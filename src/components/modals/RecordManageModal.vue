<template>
  <meta-mask-notification-modal
    id="recordManageModal"
    title="Modify Record"
    ok-title="Save"
    cancel-variant="outline-primary"
    size="lg"
    :ok-method="modifyRecord"
    :on-clear="clearModal"
  >
    <b-form-group
      label="Name"
      label-for="name"
    >
      <b-form-input
        id="name"
        v-model="name"
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
    <b-form-group
      label="Main Image"
    >
      <b-img class="main-image" thumbnail fluid :src="mainImage" alt="Main Image" />
    </b-form-group>
    <b-form-group
      label="Other Images"
    >
      <b-img class="main-image" thumbnail fluid :src="mainImage" alt="Main Image" />
    </b-form-group>
    <b-form-group
      label="Upload Images"
    >
      <vue-dropzone
        ref="dropzone"
        id="dropzone"
        :options="dropzoneOptions"
        v-on:vdropzone-file-added="fileAdded"
      />
    </b-form-group>
  </meta-mask-notification-modal>
</template>

<script>
import vue2Dropzone from 'vue2-dropzone'
import 'vue2-dropzone/dist/vue2Dropzone.min.css'

import { apiUrl } from '../../util/config'
import callContract from '../../util/web3/callContract'
import EventBus from '../../util/eventBus'
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
    const filesUrl = `${apiUrl}/users/files`
    return {
      name: this.codexRecord.metadata.name,
      description: this.codexRecord.metadata.description,
      mainImage: this.codexRecord.metadata.mainImage.uri,
      dropzoneOptions: {
        url: filesUrl,
        thumbnailWidth: 150,
        maxFilesize: 5,
        uploadMultiple: true,
      },
    }
  },
  methods: {
    fileAdded(file) {
    },
    focusModal() {
      this.$refs.defaultModalFocus.focus()
    },
    clearModal() {
      Object.assign(this.$data, this.$options.data.apply(this))
    },
    mounted() {
      console.log('codexRecord', this.codexRecord)
    },
    modifyRecord() {
      EventBus.$emit('events:record-click-transfer')
      const input = [this.toEthAddress, this.recordId]
      return callContract(this.recordContract.approve, input, this.web3)
        .then(() => {
          EventBus.$emit('events:record-transfer')
        })
        .catch((error) => {
          console.log('there was an error calling approveTransfer', error)

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
  },
}
</script>

<style lang="stylus" scoped>
.main-image
  max-width: 10rem

</style>
