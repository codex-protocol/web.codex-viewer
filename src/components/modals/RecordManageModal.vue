<template>
  <MetaMaskNotificationModal
    id="recordManageModal"
    title="Modify Record"
    ok-title="Save"
    cancel-variant="outline-primary"
    size="lg"
    :on-shown="focusModal"
    :ok-disabled="disableButton"
    :ok-method="updateMetadata"
    :on-clear="clearModal"
    :requires-tokens="true"
    :validate="validate"
    :checkout-cost="codxCosts.CodexRecord.modifyMetadataHashes"
    checkout-title="Modify Codex Record"
  >
    <template slot="checkout" v-if="codexRecord">
      <h3>{{ name }}</h3>
      <div class="image-container"><img :src="imageStreamUri || mainImage.uri"></div>
      <div class="description">{{ description }}</div>
    </template>

    <b-form-group
      label="Name"
      label-for="name"
    >
      <b-form-input
        id="name"
        v-model="name"
        ref="defaultModalFocus"
        type="text"
      />
    </b-form-group>
    <b-form-group
      label="Description"
      label-for="description"
    >
      <b-form-textarea
        id="description"
        v-model="description"
        :rows="4"
      />
    </b-form-group>
    <hr>
    <b-form-group
      label="Main Image"
    >
      <b-img
        class="record-image"
        thumbnail
        fluid
        :src="imageStreamUri || mainImage.uri"
        alt="Main Image"
      />
    </b-form-group>
    <b-form-group
      label="Replace Main Image"
    >
      <b-form-file
        class="mt-3"
        accept="image/*"
        @input="displayAndUploadFile"
      />
      <b-progress
        class="mt-2"
        v-if="progressVisible"
        :value="100"
        :animated="!uploadMainImageComplete"
        :variant="progressVariant">
      </b-progress>
    </b-form-group>
    <hr>
    <b-form-group
      v-if="images.length"
      label="Additional Images"
    >
      <span
        v-for="image in images"
        v-bind:key="image.id"
        class="additional-image"
      >
        <b-img
          class="record-image"
          thumbnail
          fluid
          :src="image.uri"
          alt="Additional Image"
        /><br>
        <b-button
          size="sm"
          variant="danger"
          @click.prevent="removeImage(image)"
        >
          Delete
        </b-button>
      </span>
    </b-form-group>
    <b-form-group
      label="Upload Additional Images"
    >
      <vue-dropzone
        ref="dropzone"
        id="dropzone"
        :options="dropzoneOptions"
        :destroyDropzone="false"
        v-on:vdropzone-success="fileAdded"
        v-on:vdropzone-removed-file="fileRemoved"
        v-on:vdropzone-processing="onFileProcessing"
        v-on:vdropzone-queue-complete="onQueueComplete"
      />
    </b-form-group>
  </MetaMaskNotificationModal>
</template>

<script>
import { mapState } from 'vuex'
import vue2Dropzone from 'vue2-dropzone'
import 'vue2-dropzone/dist/vue2Dropzone.min.css'

import File from '../../util/api/file'
import config from '../../util/config'
import Record from '../../util/api/record'
import EventBus from '../../util/eventBus'
import contractHelper from '../../util/contractHelper'
import { NullDescriptionHash } from '../../util/constants/web3'
import additionalDataHelper from '../../util/additionalDataHelper'
import MetaMaskNotificationModal from './MetaMaskNotificationModal'

export default {
  name: 'record-manage-modal',

  props: {
    codexRecord: Object,
  },

  components: {
    vueDropzone: vue2Dropzone,
    MetaMaskNotificationModal,
  },

  data() {
    return {
      name: this.codexRecord.metadata.name,
      description: this.codexRecord.metadata.description,
      mainImage: this.codexRecord.metadata.mainImage,
      mainImageId: this.codexRecord.metadata.mainImage.id,

      // @NOTE: the Array.from() here is necessary to make a copy of the array
      //  so when we modify this.images in this modal it doesn't also modify the
      //  parent component's array (the detail page shouldn't update until the
      //  modified event is emitted by the API)
      images: Array.from(this.codexRecord.metadata.images),

      uploadedMainImageFile: null,
      imageStreamUri: null,
      progressVisible: false,
      uploadMainImageComplete: false,
      uploadMainImageSuccess: false,
      isFileProcessing: false,
      newImages: [],
    }
  },

  computed: {
    ...mapState('app', ['codxCosts']),
    ...mapState('auth', ['authToken']),
    ...mapState('web3', ['instance']),

    disableButton() {
      return this.isFileProcessing || (this.progressVisible && !this.uploadMainImageSuccess)
    },

    progressVariant() {
      if (!this.uploadMainImageComplete) {
        return 'primary'
      }

      if (this.uploadMainImageSuccess) {
        return 'success'
      }

      return 'danger'
    },

    dropzoneOptions() {
      return {
        url: `${config.apiUrl}/users/files`,
        paramName: 'files',
        thumbnailWidth: 150,
        maxFilesize: 5,
        addRemoveLinks: true,
        headers: {
          Authorization: this.authToken,
        },
      }
    },
  },

  methods: {
    // Vue2-Dropzone Handlers
    fileAdded(file, response) {
      const result = response.result[0]

      this.newImages.push({
        id: result.id,
        uuid: file.upload.uuid,
      })
    },

    fileRemoved(file, error, xhr) {
      const indexToRemove = this.newImages.findIndex((image) => {
        return image.uuid === file.upload.uuid
      })

      if (indexToRemove !== -1) {
        this.newImages.splice(indexToRemove, 1)
      }
    },

    onFileProcessing() {
      this.isFileProcessing = true
    },

    onQueueComplete() {
      this.isFileProcessing = false
    },
    // End Vue2-Dropzone Handlers

    // Remove an existing image
    removeImage(imageToRemove) {
      const indexToRemove = this.images.findIndex((image) => {
        return imageToRemove.id === image.id
      })

      if (indexToRemove !== -1) {
        this.images.splice(indexToRemove, 1)
      }
    },

    // Main image handlers
    displayAndUploadFile(file) {
      if (!file) {
        return
      }

      this.uploadFile(file)

      // display the file in the dialog box
      const fileReader = new FileReader()

      fileReader.addEventListener('loadend', () => {
        this.imageStreamUri = fileReader.result
      })

      fileReader.readAsDataURL(file)
    },

    uploadFile(file) {
      this.progressVisible = true
      this.uploadMainImageSuccess = false
      this.uploadMainImageComplete = false

      File.uploadFiles(file)
        .then((uploadedFiles) => {
          this.uploadedMainImageFile = uploadedFiles[0]
          this.uploadMainImageSuccess = true
          this.mainImageId = this.uploadedMainImageFile.id
        })
        .catch((error) => {
          EventBus.$emit('toast:error', `Could not upload file: ${error.message}`)
        })
        .finally(() => {
          this.uploadMainImageComplete = true
        })
    },
    // End of main image handlers

    focusModal() {
      if (this.$refs.defaultModalFocus) {
        this.$refs.defaultModalFocus.focus()
      }
    },

    clearModal() {
      Object.assign(this.$data, this.$options.data.apply(this))

      if (this.$refs.dropzone) {
        this.$refs.dropzone.removeAllFiles()
      }
    },

    validate() {
      const errors = []

      if (!this.name) {
        errors.push('Name is required')
      }

      if (!this.mainImageId) {
        errors.push('Image is required')
      }

      return errors
    },

    updateMetadata() {
      const imageMap = (image) => {
        return {
          id: image.id,
        }
      }

      const allImages = this.newImages.map(imageMap).concat(this.images.map(imageMap))
      const updatedMetadata = {
        name: this.name,
        images: allImages,
        mainImage: { id: this.mainImageId },
        description: this.description || null,
      }

      return Record.updateMetadata(this.codexRecord.tokenId, updatedMetadata)
        .then(this.modifyRecord)
    },

    modifyRecord(pendingUpdate) {
      const input = [
        this.codexRecord.tokenId,
        pendingUpdate.nameHash,
        pendingUpdate.descriptionHash || NullDescriptionHash,
        pendingUpdate.fileHashes,
        additionalDataHelper.encode([
          process.env.VUE_APP_METADATA_PROVIDER_ID, // providerId
          this.codexRecord.metadata.id, // providerMetadataId
          pendingUpdate.id, // providerMetadataPendingUpdateId
        ]),
      ]

      // @NOTE: we don't .catch here so that the error bubbles up to MetaMaskNotificationModal
      return contractHelper('CodexRecord', 'modifyMetadataHashes', input, this.$store)
    },
  },
}
</script>

<style lang="stylus" scoped>
.record-image
  max-width: 10rem

.additional-image
  max-width: 10rem
  display: inline-block
  text-align: center

</style>
