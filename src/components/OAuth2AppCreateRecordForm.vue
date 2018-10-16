<template>
  <b-form @submit.prevent="onSubmit">
    <b-form-group
      label="Access token"
      label-for="accessToken"
    >
      <div v-text="accessToken"></div>
    </b-form-group>
    <b-form-group
      label="Title"
      label-for="title"
    >
      <b-form-input
        id="title"
        type="text"
        v-model="title"
        required
        placeholder="Enter the title"
      />
    </b-form-group>
    <b-form-group
      label="Description"
      label-for="description"
    >
      <b-form-input
        id="description"
        type="text"
        v-model="description"
        required
        placeholder="Enter a short description"
      />
    </b-form-group>
    <b-form-group
      label="Image"
      label-for="image"
    >
      <b-form-file
        id="image"
        accept="image/*"
        v-model="image"
        required
        placeholder="Upload image file"
      />
    </b-form-group>
    <b-button type="submit" variant="primary">Submit</b-button>
  </b-form>
</template>

<script>
import axios from 'axios'

export default {
  name: 'OAuth2AppCreateRecordForm',

  props: {
    showResult: Function,
    accessToken: String,
  },

  data() {
    return {
      title: null,
      description: null,
      image: null,
    }
  },

  methods: {
    onSubmit() {
      const formData = new FormData()
      formData.append('name', this.title)
      formData.append('description', this.description)
      formData.append('mainImage', this.image)

      axios.post('v1/client/record', formData, {
        headers: {
          Authorization: `Bearer ${this.accessToken}`,
          'Content-Type': `multipart/form-data; boundary=${formData._boundary}`,
        },
      }).then(this.showResult)
    },
  },
}
</script>
