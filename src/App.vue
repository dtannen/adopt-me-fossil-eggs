<template>
  <div id="app">
    <h1>Adopt Me Fossil Egg App</h1>
    <div class="divTable">
        <div class="divTableBody">
            <div v-for="item in pets" :key="item.id">
              <div class="divTableRow">
              <div class="divTableCell">{{ item.name }} </div>
              <div class="divTableCell">{{ item.img_url }} </div>
              <div class="divTableCell">{{ item.rarity }} </div>
              <div class="divTableCell">{{ item.count }} </div>
              </div>
            </div>
        </div>
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
    async getPets() {
      const pets = await API.graphql({
         query: listPets
      });
      this.pets = pets.data.listPets.items;
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

<style>

/* DivTable.com */
.divTable{
	display: table;
	width: 100%;
}
.divTableRow {
	display: table-row;
}
.divTableHeading {
	background-color: #EEE;
	display: table-header-group;
}
.divTableCell, .divTableHead {
	border: 1px solid #999999;
	display: table-cell;
	padding: 3px 10px;
}
.divTableHeading {
	background-color: #EEE;
	display: table-header-group;
	font-weight: bold;
}
.divTableFoot {
	background-color: #EEE;
	display: table-footer-group;
	font-weight: bold;
}
.divTableBody {
	display: table-row-group;
}

</style>
