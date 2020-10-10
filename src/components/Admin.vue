<template>
  <div id="app">
    <h4>Admin</h4>
    <input type="text" v-model="name" placeholder="Pet name">
    <input type="text" v-model="img_url" placeholder="Pet image url">
    <input type="text" v-model="rarity" placeholder="Rarity">
    <input type="text" v-model="count" placeholder="Count">
    <button v-on:click="createPet">Create Pet</button>
    <div class="divTable">
      <div class="divTableBody">
          <div v-for="item in pets" :key="item.id">
            <div class="divTableRow">
            <div class="divTableCell">{{ item.name }} </div>
            <button v-on:click="updatePet(item.id)">Add</button>
            </div>
          </div>
      </div>
    </div>
  </div>
</template>

<script>
import { API } from 'aws-amplify';
import { createPet, updatePet } from '../graphql/mutations';
import { listPets } from '../graphql/queries';

export default {
  name: 'admin',
  async created() {
    this.getPets();
  },
  data() {
    return {
      name: '',
      img_url: '',
      rarity: '',
      count: '',
      pets: []
    }
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
    async updatePet(id) {
      for (var i in this.pets) {
        if (this.pets[i].id == id) {
          this.pets[i].count = this.pets[i].count + 1;
        }
      }
      count = this.pets[i].count;
      const pet = { id, count };
      await API.graphql({
        query: updatePet,
        variables: {input: pet},
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
