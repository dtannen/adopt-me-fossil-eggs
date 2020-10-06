<template>
  <div id="app">
    <h1>Adopt Me Fossil Egg App</h1>
    <input type="text" v-model="name" placeholder="Pet name">
    <input type="text" v-model="img_url" placeholder="Pet image url">
    <input type="text" v-model="rarity" placeholder="Rarity">
    <input type="text" v-model="count" placeholder="Count">
    <button v-on:click="createPet">Create Pet</button>
    <div v-for="item in pets" :key="item.id">
      <h3>{{ item.name }}</h3>
      <p>{{ item.img_url }}</p>
      <p>{{ item.rarity }}</p>
      <p>{{ item.count }}</p>
      <button v-on:click="updatePet(item.id, item.count)">Add</button>
    </div>
    <!-- <router-link tag="p" to="/auth" v-if="!signedIn">
      <a>Sign Up / Sign In</a>
    </router-link> -->
    <router-view></router-view>
    <div class='sign-out'>
      <amplify-sign-out v-if="signedIn"></amplify-sign-out>
    </div>
  </div>
</template>

<script>
import { Auth, Hub, API } from 'aws-amplify';
import { createPet, updatePet } from './graphql/mutations';
import { listPets } from './graphql/queries';
import { onUpdatePet } from './graphql/subscriptions';

export default {
  name: 'app',
  async created() {
    this.getPets();
    this.subscribe();
  },
  data() {
    return {
      name: '',
      img_url: '',
      rarity: '',
      count: '',
      pets: [],
      signedIn: false
    }
  },
  beforeCreate() {
    Hub.listen('auth', data => {
      // console.log('data:', data)
      const { payload } = data
      // if (payload.event === 'signIn') {
      //   this.signedIn = true
      // }
      if (payload.event === 'signOut') {
        this.signedIn = false
      }
    })
    Auth.currentAuthenticatedUser()
      .then((user) => {
        if (user.attributes.email == 'dtannen@gmail.com') {
           this.signedIn = true
        } else {
           this.signedIn = false
        }
      })
      .catch(() => this.signedIn = false)
  },
  methods: {
    async createPet() {
      const { name, img_url, rarity, count } = this;
      if (!name || !img_url || !rarity || !count) return;
      const pet = { name, img_url, rarity, count };
      await API.graphql({
        query: createPet,
        variables: {input: pet},
      });
      this.name = '';
      this.img_url = '';
      this.rarity = '';
      this.count = '';
    },
    async getPets() {
      const pets = await API.graphql({
         query: listPets
      });
      this.pets = pets.data.listPets.items;
    },
    async updatePet(id, count) {
      count = count + 1;
      const pet = { id, count };
      await API.graphql({
        query: updatePet,
        variables: {input: pet},
      });
    },
    subscribe() {
      API.graphql({ query: onUpdatePet })
        .subscribe({
          next: (eventData) => {
            let pet = eventData.value.data.onUpdatePet;
            for (var i in this.pets) {
              if (this.pets[i].id == pet.id) {
                 this.pets[i].count++;
                 break; //Stop this loop, we found it!
              }
            }
          }
        });
    }
  }
};
</script>
