<template>
  <meta-mask-notification-modal
    id="createRecordModal"
    title="Create Record"
    ok-title="Create"
    cancel-variant="outline-primary"
    size="lg"
    :on-shown="focusModal"
    :ok-method="createMetadata"
    :on-clear="clearModal"
    :requires-tokens="true"
    :validate="validate"
  >
    <div class="flex-container">
      <div class="image-container" :class="{ 'no-image': !imageStreamUri }">
        <img :src="imageStreamUri" />
      </div>
      <div>
        <b-form-group
          label="Name" label-for="name" label-size="sm"
        >
          <b-form-input
            required
            id="name"
            type="text"
            class="mb-4"
            placeholder="e.g., Figure with horses"
            ref="defaultModalFocus"
            v-model="name"
          />
        </b-form-group>
        <b-form-group
          label="Image" label-for="imageFile" label-size="sm"
        >
          <b-form-file
            required
            id="imageFile"
            accept="image/*"
            placeholder="Upload image file"
            ref="fileInput"
            @input="displayAndUploadFile"
          />
          <b-progress
            class="mt-2"
            v-if="progressVisible"
            :value="100"
            :animated="!uploadComplete"
            :variant="progressVariant">
          </b-progress>
          <b-form-text>
            You can also drag and drop an image onto the picker.
          </b-form-text>
        </b-form-group>
        <b-form-group
          label="Description" label-for="description" label-size="sm"
        >
          <b-form-textarea
            id="description"
            placeholder="Enter item description"
            :rows="3"
            :max-rows="10"
            v-model="description"
          />
        </b-form-group>
      </div>
    </div>
  </meta-mask-notification-modal>
</template>

<script>
import debug from 'debug'
import { mapState } from 'vuex'

import File from '../../util/api/file'
import Record from '../../util/api/record'
import EventBus from '../../util/eventBus'
import contractHelper from '../../util/contractHelper'
import { NullDescriptionHash } from '../../util/constants/web3'
import additionalDataHelper from '../../util/additionalDataHelper'
import MetaMaskNotificationModal from './MetaMaskNotificationModal'

const logger = debug('app:component:create-record-modal')

export default {
  name: 'create-record-modal',

  components: {
    MetaMaskNotificationModal,
  },

  data() {
    return {
      name: null,
      description: null,
      uploadedFile: null,
      uploadedFileHash: null,
      imageStreamUri: null,
      progressVisible: false,
      uploadComplete: false,
      uploadSuccess: false,
    }
  },

  methods: {
    focusModal() {
      if (this.$refs.defaultModalFocus) {
        this.$refs.defaultModalFocus.focus()
      }
    },

    clearModal() {
      Object.assign(this.$data, this.$options.data.apply(this))

      // Manually reset the file input since it's model isn't bound to a data property
      if (this.$refs.fileInput) {
        this.$refs.fileInput.reset()
      }
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
        this.uploadedFileHash = this.instance.utils.soliditySha3(binaryFileReader.result)
      })

      binaryFileReader.readAsBinaryString(file)

    },

    uploadFile(file) {
      this.progressVisible = true
      this.uploadSuccess = false
      this.uploadComplete = false

      File.uploadFiles(file)
        .then((uploadedFiles) => {

          this.uploadedFile = uploadedFiles[0]
          this.uploadSuccess = true

        })
        .catch((error) => {
          EventBus.$emit('toast:error', `Could not upload file: ${error.message}`)
        })
        .finally(() => {
          this.uploadComplete = true
        })
    },

    validate() {
      const errors = []

      if (!this.name) {
        errors.push('Name is required')
      }

      if (!(this.uploadComplete && this.uploadSuccess)) {
        errors.push('Image is required')
      }

      return errors
    },

    createMetadata() {
      const metadataToUpload = {
        name: this.name,
        mainImage: this.uploadedFile,
        description: this.description || null,
      }

      return Record.createMetadata(metadataToUpload)
        .then((metadata) => {
          return this.createRecord(metadata)
        })
        .catch((error) => {
          logger('Could not create Record:', error)

          this.codexRecord = null

          // @NOTE: we must throw the error here so the MetaMaskNotificationModal
          //  can catch() it too
          throw error
        })
    },

    createRecord(metadata) {
      const account = this.user.address

      const { soliditySha3 } = this.instance.utils

      const input = [
        account,
        soliditySha3(metadata.name),
        metadata.description ? soliditySha3(metadata.description) : NullDescriptionHash,
        [this.uploadedFileHash],
        additionalDataHelper.encode([
          process.env.VUE_APP_METADATA_PROVIDER_ID, // providerId
          metadata.id, // providerMetadataId
        ]),
      ]

      // @NOTE: we don't .catch here so that the error bubbles up to MetaMaskNotificationModal
      return contractHelper('CodexRecord', 'mint', input, this.$store)
    },
  },

  computed: {
    ...mapState('auth', ['user']),
    ...mapState('web3', ['instance']),

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
.flex-container
  display: flex
  flex-direction: column

  input
    width: 100%

  @media screen and (min-width: $breakpoint-sm)
    flex-direction: row

    input
      width: auto

    > div
      width: 50%

.image-container
  height: 100%
  display: flex
  margin: 0 1rem
  align-items: center
  justify-content: center

  @media screen and (min-width: $breakpoint-sm)
    border: 1px solid rgba(white, .25)

  img
    max-width: 20rem
    object-fit: contain

</style>
