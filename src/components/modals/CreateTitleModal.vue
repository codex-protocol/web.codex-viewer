<template>
  <b-modal
    id="createTitleModal"
    title="Create title"
    ok-title="Create with MetaMask"
    cancel-variant="outline-primary"
    size="lg"
    v-model="modalVisible"
    v-on:shown="focusModal"
    v-on:ok="createMetaData"
  >
    <div class="flex-container">
      <div>
        <div class="image-container" :class="{ 'no-image': !imageStreamUri }">
          <img :src="imageStreamUri" />
        </div>
      </div>
      <div>
        <b-form-group
          label="Piece title" label-for="name" label-size="sm"
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
          label="Digital image" label-for="imageFile" label-size="sm"
        >
          <b-form-file
            required
            id="imageFile"
            accept="image/*"
            placeholder="Upload an image of the piece"
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
            You can also drag and drop a file onto the picker.
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
  </b-modal>
</template>

<script>
import axios from 'axios'
import callContract from '../../util/web3/callContract'

export default {
  name: 'create-title-modal',
  data() {
    return {
      name: null,
      description: null,
      uploadedFile: null,
      imageStreamUri: null,
      modalVisible: false,
      progressVisible: false,
      uploadComplete: false,
      uploadSuccess: false,
    }
  },
  methods: {
    focusModal() {
      this.$refs.defaultModalFocus.focus()
    },
    displayAndUploadFile(file) {
      if (!file) {
        return
      }

      this.uploadFile(file)

      // display the file in the dialog box
      const fileReader = new FileReader()
      fileReader.onload = (loadEvent) => {
        this.imageStreamUri = loadEvent.target.result
      }

      fileReader.readAsDataURL(file)
    },
    uploadFile(file) {
      this.progressVisible = true
      this.uploadSuccess = false
      this.uploadComplete = false

      const formData = new FormData()
      formData.append('files', file)

      axios.post('/users/files', formData, { headers: {
        'Content-Type': `multipart/form-data; boundary=${formData._boundary}`,
      } }).then((response) => {
        const { result, error } = response.data
        this.uploadComplete = true

        if (error) {
        // TODO: display an error
          console.log('there was an error uploading the file', error)
        } else {
          console.log('file uploaded', result)

          this.uploadSuccess = true
          this.uploadedFile = result
        }
      }).catch((error) => {
        this.uploadComplete = true

        // TODO: display an error
        console.log('there was an error uploading the file', error)
      })
    },
    createMetaData(event) {
      event.preventDefault()

      // TODO: Show some better error handling if these aren't filled in
      if (!this.name || !this.uploadedFile) {
        return
      }

      axios.post('/users/title-metadata', {
        name: this.name,
        files: this.uploadedFile,
        description: this.description || null,
      }).then((response) => {
        const { result, error } = response.data
        if (error) {
          console.log('there was an error calling getTitle', error)
          this.codexTitle = null
          this.error = error
        } else {
          console.log('codexTitleMetadata', result)
          this.createTitle(result)
        }
      }).catch((error) => {
        console.log('there was an error calling getTitle', error)
        this.codexTitle = null
        this.error = error
      })
    },
    createTitle(transactionData) {
      const { sha3 } = this.web3.instance()
      const { account } = this.web3
      const input = [
        account,
        sha3(transactionData.name),
        sha3(transactionData.description),
        sha3(transactionData.imageUri), // TODO: calculate hash of binary data here instead
        '1', // providerId
        transactionData.id,
      ]

      callContract(this.contract.mint, input, this.web3)
        .then(() => {
          this.modalVisible = false
        })
        .catch((error) => {
          console.log('There was an error creating the title', error)
        })
    },
  },
  computed: {
    web3() {
      return this.$store.state.web3
    },
    contract() {
      return this.$store.state.web3.contractInstance()
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
  watch: {
    // When the modal dialog is closed, we reset the component data
    modalVisible(newVisibility) {
      if (!newVisibility) {
        Object.assign(this.$data, this.$options.data.apply(this))
        this.$refs.fileInput.reset()
      }
    },
  },
}
</script>

<style lang="stylus" scoped>
.flex-container
  display: flex
  flex-direction: row

.flex-container > div
  width: 50%

.image-container
  height: 100%
  display: flex
  margin: 0 1rem
  align-items: center
  justify-content: center
  background-color: rgba(white, .1)
  border: 1px solid rgba(white, .25)

  img
    max-width: 100%
    max-height: 100%
    object-fit: contain

</style>
