<template>
  <meta-mask-notification-modal
    id="recordManageModal"
    title="Modify Record"
    ok-title="Save"
    cancel-variant="outline-primary"
    size="lg"
    :ok-method="updateMetadata"
    :on-clear="clearModal"
  >
    <b-form-group
      label="Name"
      label-for="name"
    >
      <b-form-input
        id="name"
        v-model="name"
        @input="updateNameHash"
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
        @input="updateDescriptionHash"
        :rows="4"
      />
    </b-form-group>
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
        v-model="newMainImageFile"
        class="mt-3"
        accept="image/*"
        @input="displayAndUploadFile"
      />
      <b-progress
        class="mt-2"
        v-if="progressVisible"
        :value="100"
        :animated="!uploadComplete"
        :variant="progressVariant">
      </b-progress>
    </b-form-group>
    <b-form-group
      v-if="images.length"
      label="Other Images"
    >
      <span
        v-for="image in images"
        v-bind:key="image.id"
        class="other-image"
      >
        <b-img
          class="record-image"
          thumbnail
          fluid
          :src="image.uri"
          alt="Other Image"
        /><br>
        <b-button
          size="sm"
          variant="danger"
          @click.prevent="removeImage(image.id)"
        >
          Delete
        </b-button>
      </span>
    </b-form-group>
    <b-form-group
      label="Upload Images"
    >
      <vue-dropzone
        ref="dropzone"
        id="dropzone"
        :options="dropzoneOptions"
        :destroyDropzone="false"
        v-on:vdropzone-success="fileAdded"
        v-on:vdropzone-removed-file="fileRemoved"
      />
    </b-form-group>
  </meta-mask-notification-modal>
</template>

<script>
import axios from 'axios'
import vue2Dropzone from 'vue2-dropzone'
import 'vue2-dropzone/dist/vue2Dropzone.min.css'
import EventBus from '../../util/eventBus'

import { apiUrl } from '../../util/config'
import callContract from '../../util/web3/callContract'
import MetaMaskNotificationModal from './MetaMaskNotificationModal'

export default {
  name: 'record-manage-modal',
  props: [
    'codexRecord',
  ],
  components: {
    vueDropzone: vue2Dropzone,
    MetaMaskNotificationModal,
  },
  data() {
    const images = []
    for (let i = 0; i < this.codexRecord.metadata.images.length; i++) {
      images.push(this.codexRecord.metadata.images[i])
    }

    const imageIds = []
    for (let i = 0; i < this.codexRecord.metadata.images.length; i++) {
      imageIds.push({ id: this.codexRecord.metadata.images[i].id })
    }

    const filesUrl = `${apiUrl}/users/files`
    return {
      name: this.codexRecord.metadata.name,
      description: this.codexRecord.metadata.description,
      mainImage: this.codexRecord.metadata.mainImage,
      mainImageId: this.codexRecord.metadata.mainImage.id,
      images,
      imageIds,
      nameHash: this.codexRecord.metadata.nameHash,
      descriptionHash: this.codexRecord.metadata.descriptionHash,
      fileHashes: this.codexRecord.metadata.fileHashes,
      newMainImageFile: null,
      tokenId: this.codexRecord.tokenId,
      providerMetadataId: this.codexRecord.metadata.id,
      dropzoneOptions: {
        url: filesUrl,
        paramName: 'files',
        thumbnailWidth: 150,
        maxFilesize: 5,
        addRemoveLinks: true,
        headers: { Authorization: this.$store.state.auth.authToken },
      },
      uploadedFile: null,
      uploadedFileHash: null,
      imageStreamUri: null,
      progressVisible: false,
      uploadComplete: false,
      uploadSuccess: false,
    }
  },
  methods: {
    getMainImageId() {
      return { id: this.mainImageId }
    },
    setMainImageId(id) {
      this.mainImageId = id
    },
    addImage(id, uuid) {
      this.imageIds.push({ id, uuid })
    },
    removeAddedImage(uuid) {
      for (let i = 0; i < this.imageIds.length; i++) {
        if (this.imageIds[i].uuid === uuid) {
          this.imageIds.splice(i, 1)
        }
      }
    },
    removeImage(id) {
      for (let i = 0; i < this.imageIds.length; i++) {
        if (this.imageIds[i].id === id) {
          this.imageIds.splice(i, 1)
          this.images.splice(i, 1)
        }
      }
    },
    updateNameHash() {
      this.nameHash = this.hash(this.name)
    },
    updateDescriptionHash() {
      this.descriptionHash = this.hash(this.description)
    },
    hash(input) {
      return this.$store.state.web3.instance().sha3(input)
    },
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

      // hash the file's binary data
      const binaryFileReader = new FileReader()

      binaryFileReader.addEventListener('loadend', () => {
        this.uploadedFileHash = this.web3.instance().sha3(binaryFileReader.result)
      })

      binaryFileReader.readAsBinaryString(file)

    },
    uploadFile(file) {

      this.progressVisible = true
      this.uploadSuccess = false
      this.uploadComplete = false

      const formData = new FormData()
      formData.append('files', file)

      const requestOptions = {

        method: 'post',
        url: '/users/files',

        headers: {
          'Content-Type': `multipart/form-data; boundary=${formData._boundary}`,
        },

        data: formData,
      }

      axios(requestOptions)
        .then((response) => {

          const { result } = response.data

          this.uploadedFile = result[0]
          this.uploadSuccess = true
          this.setMainImageId(this.uploadedFile.id)

        })
        .catch((error) => {
          EventBus.$emit('toast:error', `Could not upload file: ${error.message}`)
          console.error('Could not upload file:', error)
        })
        .finally(() => {
          this.uploadComplete = true
        })
    },
    getImageIds() {
      const imageIds = this.imageIds.map((imageId) => {
        return { id: imageId.id }
      })
      return imageIds
    },
    fileAdded(file, response) {
      const result = response.result[0]
      const { uuid } = file.upload
      const { id } = result
      this.addImage(id, uuid)
    },
    fileRemoved(file, error, xhr) {
      const { uuid } = file.upload
      this.removeAddedImage(uuid)
    },
    focusModal() {
      this.$refs.defaultModalFocus.focus()
    },
    clearModal() {
      Object.assign(this.$data, this.$options.data.apply(this))
    },
    updateMetadata() {
      const url = `/users/records/${this.tokenId}/metadata`

      return axios.put(url, {
        name: this.name,
        description: this.description,
        mainImage: this.getMainImageId(),
        images: this.getImageIds(),
      }).then((response) => {
        const { result, error } = response.data
        if (error) {
          throw error
        } else {
          const { nameHash, descriptionHash, fileHashes } = result.pendingUpdates[0]
          return this.modifyRecord(nameHash, descriptionHash, fileHashes)
        }
      }).catch((error) => {
        throw error
      })
    },
    modifyRecord(nameHash, descriptionHash, fileHashes) {
      const input = [
        this.tokenId,
        this.nameHash,
        this.descriptionHash,
        fileHashes,
        '1',
        this.providerMetadataId,
      ]
      return callContract(this.recordContract.modifyMetadataHashes, input, this.web3)
        .catch((error) => {
          console.error('there was an error calling modifyMetadataHashes', error)

          // @NOTE: we must throw the error here so the MetaMaskNotificationModal
          //  can catch() it too
          throw error
        })
    },
  },
  computed: {
    web3() {
      return this.$store.state.web3
    },
    recordContract() {
      return this.web3.recordContractInstance()
    },
    progressVariant() {
      if (!this.uploadComplete) {
        return 'primary'
      }

      if (this.uploadSuccess) {
        return 'success'
      }

      return 'danger'
    },
  },
}
</script>

<style lang="stylus" scoped>
.record-image
  max-width: 10rem

.other-image
  max-width: 10rem
  display: inline-block
  text-align: center

</style>
