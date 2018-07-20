<template>
  <meta-mask-notification-modal
    id="createRecordModal"
    title="Create Record"
    ok-title="Create"
    :ok-disabled="!canSubmit"
    cancel-variant="outline-primary"
    size="lg"
    :on-shown="focusModal"
    :ok-method="createMetaData"
    :on-clear="clearModal"
    :requires-tokens="true"
  >
    <div class="flex-container">
      <div>
        <div class="image-container" :class="{ 'no-image': !imageStreamUri }">
          <img :src="imageStreamUri" />
        </div>
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

import File from '../../util/api/file'
import Record from '../../util/api/record'
import EventBus from '../../util/eventBus'
import callContract from '../../util/web3/callContract'
import additionalDataHelper from '../../util/additionalDataHelper'
import MetaMaskNotificationModal from './MetaMaskNotificationModal'

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

      // @TODO: explain why this is necessary (only exists when slot is filled
      //  in MMNM)
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
        this.uploadedFileHash = this.web3.instance().sha3(binaryFileReader.result)
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
    createMetaData() {

      // TODO: Show some better error handling if these aren't filled in
      if (!this.canSubmit) {
        return Promise.reject(new Error('Could not create Record: Missing required fields.'))
      }

      const metadataToUpload = {
        name: this.name,
        mainImage: this.uploadedFile,
        description: this.description || null,
      }

      return Record.createMetadata(metadataToUpload)
        .then((metadata) => {

          // TODO: maybe show somewhere that the locally-calculated hashes match
          //  the server-side-calculated hashes? e.g.:
          // const { sha3 } = this.web3.instance()
          //
          // metadata.nameHash === sha3(metadata.name)
          // metadata.mainImage.hash === this.uploadedFileHash
          // metadata.descriptionHash === (metadata.description ? sha3(metadata.description) : null)

          return this.createRecord(metadata)

        })
        .catch((error) => {
          console.error('Could not create Record:', error)

          this.codexRecord = null

          // @NOTE: we must throw the error here so the MetaMaskNotificationModal
          //  can catch() it too
          throw error
        })
    },
    createRecord(metadata) {

      const { sha3 } = this.web3.instance()
      const { account } = this.web3
      const input = [
        account,
        sha3(metadata.name),
        metadata.description ? sha3(metadata.description) : '',
        [this.uploadedFileHash],
        additionalDataHelper.encode([
          process.env.METADATA_PROVIDER_ID, // providerId
          metadata.id, // providerMetadataId
        ]),
      ]

      // @NOTE: we don't .catch here so that the error bubbles up to MetaMaskNotificationModal
      return callContract(this.recordContract.mint, input, this.web3)
    },
  },
  computed: {
    web3() {
      return this.$store.state.web3
    },
    canSubmit() {
      return this.name && this.uploadedFileHash && this.uploadedFile
    },
    recordContract() {
      return this.$store.state.web3.recordContractInstance()
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
  background-color: rgba(white, .1)

  @media screen and (min-width: $breakpoint-sm)
    border: 1px solid rgba(white, .25)

  img
    max-width: 100%
    max-height: 100%
    object-fit: contain

</style>
