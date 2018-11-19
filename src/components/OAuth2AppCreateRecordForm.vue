<template>
  <b-form @submit.prevent="onSubmit">
    <b-form-group
      label="Access token"
      label-for="accessToken"
    >
      <div v-text="accessToken"></div>
    </b-form-group>
    <b-form-group
      label="Name"
      label-for="name"
    >
      <b-form-input
        id="name"
        type="text"
        v-model="name"
        required
        placeholder="Enter the name"
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
    <b-form-group
      label="Share Record Publicly"
      label-for="isPublic"
      label-size="sm"
    >
      <input
        id="isPublic"
        type="checkbox"
        v-model="isPublic"
        class="toggle-checkbox"
      />
      <b-form-text>
        By making this Record public, anyone can view the name, description and images.
      </b-form-text>
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
      name: null,
      image: null,
      isPrivate: true,
      description: null,
    }
  },

  methods: {
    onSubmit() {
      const formData = new FormData()
      formData.append('name', this.name)
      formData.append('mainImage', this.image)
      formData.append('isPrivate', this.isPrivate)
      formData.append('description', this.description)

      axios.post('v1/client/record', formData, {
        headers: {
          Authorization: `Bearer ${this.accessToken}`,
          'Content-Type': `multipart/form-data; boundary=${formData._boundary}`,
        },
      }).then(this.showResult)
    },
  },

  computed: {
    isPublic: {
      get: function getIsPublic() {
        return !this.isPrivate
      },
      set: function setIsPublic(newValue) {
        this.isPrivate = !newValue
      },
    },
  }
}
</script>
