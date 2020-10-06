<template>
  <div id="app">
    <!-- <h1>Adopt Me Fossil Egg App</h1>
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
    </div> -->
    <header>
      <div class="container text-center">
      <h1>Elle's Adopt Me Dino Hunt</h1>
      <a href="https://www.youtube.com/channel/UCcg4Vr0rCm7tW4zoJfPqS-Q" target="_blank">
        <button type="button" class="btn btn-danger"><i class="fab fa-youtube"></i> YouTube</button>
      </a>
    </div>
  </header>
    <main>
      <div class="container">
        <div class="jumbotron">

          <div class="table-responsive">

            <table class="table">
              <thead>
                <tr>
                  <th scope="col"><h5>Quantity</h5></th>
                  <th scope="col"><h5>Pet</h5></th>
                  <th scope="col"><h5>Image</h5></th>
                  <th scope="col"><h5>Rarity</h5></th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="item in pets" :key="item.id">
                  <td class="align-middle"><h3><b>{{ item.count }}</b></h3></td>
                  <td class="align-middle"><h4>{{ item.name }}</h4></td>
                  <td class="align-middle"><img :src="item.img_url" alt="" /></td>
                  <td class="align-middle"><h4>{{ item.rarity }}</h4></td>
                </tr>
              </tbody>
            </table>

          </div>
        </div>
      </div>
    </main>

    <section class="container text-center">
      <div class="jumbotron">
        <h1>Total pets:</h1>
        <h1><b>{{ total_pets }}</b></h1>
      </div>
    </section>
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
      total_pets: 0,
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
  computed: {

  },
  methods: {
    async getPets() {
      const pets = await API.graphql({
         query: listPets
      });
      this.pets = pets.data.listPets.items;
      for (var i in this.pets) {
        this.total_pets = this.total_pets + this.pets[i].count;
      }
      // this.pets.sort((a, b) => a.rarity.localeCompare(b.rarity));
      this.pets.sort((a, b) => parseFloat(b.count) - parseFloat(a.count));
    },
    subscribe() {
      API.graphql({ query: onUpdatePet })
        .subscribe({
          next: (eventData) => {
            let pet = eventData.value.data.onUpdatePet;
            for (var i in this.pets) {
              if (this.pets[i].id == pet.id) {
                 this.pets[i].count++;
                 this.total_pets++;
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

body {
  font-family: poplar-std, sans-serif;
}

header {
  padding: 20px;
  font-weight: bold;
}

#total {
  font-weight: bold;
}

</style>
