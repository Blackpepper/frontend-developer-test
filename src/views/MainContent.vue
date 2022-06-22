<template>
  <div class="main-content">
    <button @click="count++">Count is: {{ count }}</button>
    <table  cellspacing="0" cellpadding="0">
      <thead>
        <tr>
          <th></th>
          <th>
            <div class="margin-tp-15">
              <div class="font-light">Trader 1</div>
              <select v-model="selectedTraderOne" @change="getTraderOneInfo()">
                <option value="">Select</option>
                <option v-for="record in martianList" 
                  :key="record.martinid" 
                  v-bind:value="record.name">
                  {{ record.name }}
                </option>
              </select>
            </div>
          </th>
          <th>
            <div>
              <div class="font-light">Trader 2</div>
              <select v-model="selectedTraderTwo" @change="getTraderTwoInfo()">
                <option value="">Select</option>
                <option v-for="record in martianList" 
                  :key="record.martinid" 
                  v-bind:value="record.name">
                  {{ record.name}}
                </option>
              </select>
            </div>
          </th>
        </tr>

      </thead>
      <tbody>
        <tr v-for="item in martianItems" :key="item.id">
          <td>
            <span class="padding-rl-25">{{ item.name }}</span>
          </td>
          <td align="center">
            <div v-for="i in traderOneObject.inventory" :key="i.itemid">
              <div v-if ="i.itemid === item.itemid">
                <button @click="i.quantity--">
                <font-awesome-icon class="white" icon="fa-solid fa-circle-minus" />
                </button>
                <span class="spanStyle">{{i.quantity}} / {{i.points}}</span>
                <button @click="i.quantity++">
                  <font-awesome-icon class="white" icon="fa-solid fa-circle-plus" />
                </button>
              </div>
            </div>
          </td>
          <td align="center">
            <div v-for="i in traderTwoObject.inventory" :key="i.itemid">
              <div v-if ="i.itemid === item.itemid">
                <button @click="i.quantity--">
                <font-awesome-icon class="white" icon="fa-solid fa-circle-minus" />
                </button>
                <span class="spanStyle">{{i.quantity}} / {{i.points}}</span>
                <button  @click="i.quantity++">
                  <font-awesome-icon class="white" icon="fa-solid fa-circle-plus" />
                </button>
              </div>
            </div>
          </td>
        </tr>
      </tbody>
      <tfoot>
        <tr>
          <td><span class="padding-25 margin-25">Total</span></td>
          <td align="center">{{ computeTrader1 }}</td>
          <td align="center">{{ computeTrader2 }}</td>
        </tr>
      </tfoot>
    </table>
    <div class="main-footer">
      <button @click="clearData()">Reset</button>
      <button class="gray" @click="postMartianTrade()">Trade</button>
    </div>
  </div>

</template>

<script>
// import { ref } from 'vue'
import axios from 'axios'
import Swal from 'sweetalert2'

export default {
  data() {
    return {
      count: 0,
      martianList: [],
      martianItems: [],
      selectedTraderOne:null,
      selectedTraderTwo:null,

      traderOneObject : {
        martianid: null,
        inventory: [
          {
            itemid: 1,
            name: "Oxygen",
            points: 0, 
            quantity: 0
          },
          {
            itemid: 2,
            name: "Water",
            points: 0,
            quantity: 0
          },
          {
            itemid: 3,
            name: "Food",
            points: 0,
            quantity: 0
          },
          {
            itemid: 4,
            name: "Medication",
            points: 0, 
            quantity: 0
          },
          {
            itemid: 5,
            name: "Clothing",
            points: 0, 
            quantity: 0
          }
        ]
      }, 
      traderTwoObject : {
        martianid: null,
        inventory: [
          {
            itemid: 1,
            name: "Oxygen",
            points: 0, 
            quantity: 0
          },
          {
            itemid: 2,
            name: "Water",
            points: 0,
            quantity: 0
          },
          {
            itemid: 3,
            name: "Food",
            points: 0,
            quantity: 0
          },
          {
            itemid: 4,
            name: "Medication",
            points: 0, 
            quantity: 0
          },
          {
            itemid: 5,
            name: "Clothing",
            points: 0, 
            quantity: 0
          }
        ]
      }, 

      finalTradeObject: {
        buyFrom: {
          martianid: 9,
          items: [
            {
              "itemid": 1,
              "quantity": 4
            }
          ]
        },
        sellTo: {
          martianid: 8,
          items: [
            {
              "itemid": 1,
              "quantity": 5
            }
          ]
        }
      },
      traderOneObject1 :{},
      totalTrader1: 0
    }
  },
  watch: {},
  computed:{

   computeTrader1() {
    let oxygen = this.computeOxygen(this.traderOneObject.inventory[0].quantity,this.traderOneObject.inventory[0].points);
    let water = this.computeWater(this.traderOneObject.inventory[1].quantity,this.traderOneObject.inventory[1].points);
    let food = this.computeWater(this.traderOneObject.inventory[2].quantity,this.traderOneObject.inventory[2].points);
    let medication = this.computeWater(this.traderOneObject.inventory[3].quantity,this.traderOneObject.inventory[3].points);
    let clothing = this.computeWater(this.traderOneObject.inventory[4].quantity,this.traderOneObject.inventory[4].points);

    return oxygen+water+food+medication+clothing
   },
   computeTrader2() {
    let oxygen = this.computeOxygen(this.traderTwoObject.inventory[0].quantity,this.traderTwoObject.inventory[0].points);
    let water = this.computeWater(this.traderTwoObject.inventory[1].quantity,this.traderTwoObject.inventory[1].points);
    let food = this.computeWater(this.traderTwoObject.inventory[2].quantity,this.traderTwoObject.inventory[2].points);
    let medication = this.computeWater(this.traderTwoObject.inventory[3].quantity,this.traderTwoObject.inventory[3].points);
    let clothing = this.computeWater(this.traderTwoObject.inventory[4].quantity,this.traderTwoObject.inventory[4].points);

    return oxygen+water+food+medication+clothing
   },

    getFinalTradeOnbject() {
      return this.finalTradeObject
    }
  },
  mounted() {
    this.getMartianList()
    this.getMartianItems()
    this.selectedTraderOne = ''
    this.selectedTraderTwo = ''
  },
  methods: {
    getMartianList() {
      axios.get('https://www.blackpepper.co.nz/api/martian')
        .then((res) => {
          if (res) {
            this.martianList = res.data.data
          }
        })
    },

    getMartianItems() {
      axios.get('https://www.blackpepper.co.nz/api/martian/items')
        .then((res) => {
          if (res) {
            this.martianItems = res.data.data
          }
        })
    }, 
    postMartianTrade(){
      Swal.fire({
        title: 'Are you sure you want to proceed in trading?',
        showCancelButton: true,
        confirmButtonText: 'Yes, Im sure',
      }).then((result) => {
        if (result.isConfirmed) {
          let data = this.getFinalTradeOnbject
          axios.post('https://www.blackpepper.co.nz/api/martian/trade', data)
            .then((res) => {
              if(res) {
                Swal.fire('',res.data.data.message,'success')
              }
            })
            .catch(error => {
              this.errorMessage = error.message;
              console.error("There was an error! -----", error.message);
              Swal.fire('',error.message,'error')
            });
        } else {
          console.log('Cancelled Trade...')
        }
      })
    },

    getTraderOneInfo: function () {
      alert()
      let selData = {}
      let selDataInventory = []
      let aa = []
      let bb = []

      if (this.selectedTraderOne) {
        selData = this.martianList.filter(res => res.name == this.selectedTraderOne)
        selData[0].inventory.filter(res => {
          if (res.itemid) {
            selDataInventory.push(res)
          }
        })
        aa = [...this.traderOneObject.inventory]
        bb = selDataInventory.filter(res1 => aa.some(res2 => res1.itemid === res2.itemid))
        let r = aa.filter(e => !bb.find(a => e.itemid === a.itemid));
        // eslint-disable-next-line vue/no-side-effects-in-computed-properties
        this.traderOneObject = {
          martianid: selData[0].martianid,
          inventory: [...bb, ...r]
        }
      }
      
      return this.traderOneObject

    },
    getTraderTwoInfo () {
    let selData = {} 
    let selDataInventory= []
    let aa = []
    let bb = []
    
    if (this.selectedTraderTwo) {
      selData = this.martianList.filter(res => res.name  == this.selectedTraderTwo)
      selData[0].inventory.filter(res => {
        if(res.itemid){
          selDataInventory.push(res)
        }
      })
      aa = [...this.traderTwoObject.inventory]
      bb = selDataInventory.filter(res1 => aa.some(res2 => res1.itemid === res2.itemid))
      let r = aa.filter(e => !bb.find(a => e.itemid === a.itemid));
      // eslint-disable-next-line vue/no-side-effects-in-computed-properties
      this.traderTwoObject = {
        martianid:selData[0].martianid,
        inventory:[...bb, ...r]
      }
    }
    return this.traderTwoObject
   },
    computeOxygen : function(qty,pts){
      return pts != 0 ?  qty *  pts :  qty * 6
    },
    computeWater : function(qty,pts) {
      return pts != 0 ?  qty *  pts :  qty * 4
    },
    computeFood: function(qty,pts) {
      return pts != 0 ?  qty *  pts :  qty * 3
    }, 
    computeMedication : function(qty,pts) {
      return pts != 0 ?  qty *  pts :  qty * 2
    },
    computeClothing : function(qty,pts) {
      return pts != 0 ?  qty *  pts :  qty * 2
    },
    

    clearData: function(){
      Object.assign(this.$data, this.$options.data());
      this.getMartianList()
      this.getMartianItems()
      this.selectedTraderOne = ''
      this.selectedTraderTwo = ''
    }
  }
}
</script>
<style scoped lang="scss">

.white { color:#fff }
.font-light { font-weight: 400 }
.font-heavy { font-weight: 600 }
.margin-tp-15 { margin: 15px 0 }
.margin-25 { margin:25px 0 }
.padding-25 { padding: 25px 25px }
.padding-rl-25 { padding: 0 25px }

select{ 
 color: #fff;
 background: transparent;
 border: none;
 margin:15px 0 
 }
select option { background-color: black; }
.main-content {
  position: absolute;
  left: 136px;
  top: 180px;
  z-index: 10;
  background-color: transparent;

  table { width: 770px;}
  table,
  thead,
  tr,
  td,
  .main-footer,
  button {
    background-color: transparent;
    border:none;
  }

 tbody td{ padding:25px 0; border:none}

 table tbody tr:nth-child(odd) {
   background: rgb(255,255,255,0.1);
   color:#fff
 }
tfoot {
  td { 
    padding: 25px 0;
    border-bottom: 1px solid rgb(255,255,255,0.1)  
  }
}

  .main-footer{
    margin:25px 0;
    padding:25px 0;
    text-align: right;

    button {
        margin-left: 25px;
        padding: 15px;
        width: 160px;
        border: 1px solid #fff;
        border-radius: 45px;
        color: #fff;
        text-transform: uppercase;
        letter-spacing: 4px;
        font-size: 12px;
    
      }
    button.gray{
      background:rgb(255,255,255,0.5);
      border: 1px solid #000;
    }
    button:hover{
      background-color: #FF3A44;
      border:1px solid #FF3A44; 
    }

  }
  .spanStyle{
    margin:0 10px; 
    padding:0 0; 
    display: inline-block;
    width:90px;
  }

}
</style>

