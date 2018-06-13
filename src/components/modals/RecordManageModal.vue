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
      <b-img
        class="main-image"
        thumbnail
        fluid
        :src="mainImage"
        alt="Main Image"
      />
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
          class="main-image"
          thumbnail
          fluid
          :src="image.uri"
          alt="Main Image"
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
      mainImage: this.codexRecord.metadata.mainImage.uri,
      images,
      imageIds,
      dropzoneOptions: {
        url: filesUrl,
        paramName: 'files',
        thumbnailWidth: 150,
        maxFilesize: 5,
        addRemoveLinks: true,
        headers: { Authorization: this.$store.state.auth.authToken },
      },
    }
  },
  methods: {
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
        nameHash,
        descriptionHash,
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
    tokenId() {
      return this.codexRecord.tokenId
    },
    providerMetadataId() {
      return this.codexRecord.metadata.id
    },
  },
}
</script>

<style lang="stylus" scoped>
.main-image
  max-width: 10rem

.other-image
  display: inline-block
  text-align: center

</style>
