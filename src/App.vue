<template>
  <div id="app">
    <div class="row no-gutters">
      <div class="col-sm-3">
        <div class="toolbox">
          <div class="sticky-top p-4">
            <div class="form-group d-flex">
              <div class="flex-fill">
                <select
                  id="cityName"
                  class="form-control"
                  v-model="selected.city"
                  @change="removeMarker(); updateSelect(); updateMap()"
                >
                  <option value selected disabled>請選擇城市</option>
                  <option
                    :value="item.CityName"
                    v-for="item in CityCountyData"
                    :key="item.CityName"
                  >{{ item.CityName }}</option>
                </select>
              </div>
            </div>
            <div class="form-group d-flex">
              <div class="flex-fill">
                <select
                  id="areaName"
                  class="form-control"
                  v-model="selected.area"
                  @change="removeMarker(); updateMap()"
                >
                  <option value selected disabled>請選擇地區</option>
                  <option
                    :value="area.AreaName"
                    v-for="area in CityCountyData.find(
                    (city) => city.CityName === selected.city).AreaList"
                    :key="area.AreaName"
                  >{{ area.AreaName }}</option>
                </select>
              </div>
            </div>
            <p class="mb-0 text-right">
              有取得口罩數量的藥局有
              <span class="h4 text-mask">{{ pharmacyNum }}</span> 家
            </p>
          </div>
          <ul class="list-group" v-if="selected.area !== ''">
            <template v-for="(item, key) in data">
              <a
                class="list-group-item text-left p-4 border-bottom"
                :key="key"
                v-if="item.properties.county === selected.city &&
              item.properties.town === selected.area"
                @click="pento(item)"
              >
                <h2 class="pharmacy-name">{{ item.properties.name }}</h2>
                <p class="mb-2">
                  <a
                    v-bind:href="`https://www.google.com.tw/maps/place/${item.properties.address}`"
                    target="_blank"
                    title="Google Map"
                    class="text-secondary pharmacy-info"
                  >
                    <img src="./assets/images/map-marker-alt-solid.svg" class="mr-2">
                    {{ item.properties.address }}
                  </a>
                </p>
                <p class="mb-2 text-secondary pharmacy-info">
                  <img src="./assets/images/phone.svg" class="mr-2">
                  {{ item.properties.phone }}
                </p>
                <div
                  class="btn-group w-100"
                  role="group"
                  :class="{'border-middle':
                item.properties.mask_adult!==0 && item.properties.mask_child!==0}"
                >
                  <button
                    type="button"
                    class="btn btn-mask w-100 btn-adult"
                    :class="{'btn-lightGrey': item.properties.mask_adult===0}"
                  >
                    <span v-if="item.properties.mask_adult===0">成人：已售完</span>
                    <span v-else>成人：{{ item.properties.mask_adult }} 個</span>
                  </button>
                  <button
                    type="button"
                    class="btn btn-mask w-100 btn-child"
                    :class="{'btn-lightGrey': item.properties.mask_child===0}"
                  >
                    <span v-if="item.properties.mask_child===0">兒童：已售完</span>
                    <span v-else>兒童：{{ item.properties.mask_child }} 個</span>
                  </button>
                </div>
              </a>
            </template>
          </ul>
          <ul class="list-group" v-else>
            <template v-for="(item, key) in data">
              <a
                class="list-group-item text-left p-4 border-bottom"
                :key="key"
                v-if="item.properties.county === selected.city"
                @click="pento(item)"
              >
                <h2 class="pharmacy-name">{{ item.properties.name }}</h2>
                <p class="mb-2">
                  <a
                    v-bind:href="`https://www.google.com.tw/maps/place/${item.properties.address}`"
                    target="_blank"
                    title="Google Map"
                    class="text-secondary pharmacy-info"
                  >
                    <img src="./assets/images/map-marker-alt-solid.svg" class="mr-2">
                    {{ item.properties.address }}
                  </a>
                </p>
                <p class="mb-2 text-secondary pharmacy-info">
                  <img src="./assets/images/phone.svg" class="mr-2">
                  {{ item.properties.phone }}
                </p>
                <div
                  class="btn-group w-100"
                  role="group"
                  :class="{'border-middle':
                item.properties.mask_adult!==0 && item.properties.mask_child!==0}"
                >
                  <button
                    type="button"
                    class="btn btn-mask w-100 btn-adult"
                    :class="{'btn-lightGrey': item.properties.mask_adult===0}"
                  >
                    <span v-if="item.properties.mask_adult===0">成人：已售完</span>
                    <span v-else>成人：{{ item.properties.mask_adult }} 個</span>
                  </button>
                  <button
                    type="button"
                    class="btn btn-mask w-100 btn-child"
                    :class="{'btn-lightGrey': item.properties.mask_child===0}"
                  >
                    <span v-if="item.properties.mask_child===0">兒童：已售完</span>
                    <span v-else>兒童：{{ item.properties.mask_child }} 個</span>
                  </button>
                </div>
              </a>
            </template>
          </ul>
        </div>
      </div>
      <div class="col-sm-9 d-none d-sm-block">
        <div id="map"></div>
      </div>
    </div>
  </div>
</template>

<script>
import L from 'leaflet';
import CityCountyData from './assets/CityCountyData.json';

let osmMap = {};
const blueIcon = new L.Icon({
  iconUrl: 'https://i.imgur.com/Iehvre0.png',
  shadowUrl:
    'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
  iconSize: [32, 43],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});
const greyIcon = new L.Icon({
  iconUrl:
    'https://cdn.rawgit.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-grey.png', // icon 圖示
  shadowUrl:
    'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
  iconSize: [32, 43],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

export default {
  name: 'App',
  data() {
    return {
      data: [],
      CityCountyData,
      selected: {
        city: '彰化縣',
        area: '社頭鄉',
      },
      isChanged: false,
      pharmacyNum: 0,
    };
  },
  methods: {
    updateMap() {
      const vm = this;
      // 將資料內容一一取出
      const pharmacies = vm.data.filter((pharmacy) => {
        if (vm.selected.area === '') {
          return pharmacy.properties.county === vm.selected.city;
        }
        return pharmacy.properties.town === vm.selected.area;
      });
      vm.pharmacyNum = pharmacies.length;
      // 把圖標加到畫面上
      pharmacies.forEach((pharmacy) => {
        const { properties, geometry } = pharmacy;
        const mask = (properties.mask_adult === 0) ? greyIcon : blueIcon;
        const btnAdult = (properties.mask_adult === 0) ? '<button class="btn btn-lightGrey w-100 btn-adult">成人：已售完</button>' : `<button class="btn btn-mask w-100 btn-adult">成人：${properties.mask_adult} 個</button>`;
        const btnChild = (properties.mask_child === 0) ? '<button class="btn btn-lightGrey w-100 btn-child">兒童：已售完</button>' : `<button class="btn btn-mask w-100 btn-child">兒童：${properties.mask_child} 個</button>`;
        const btnGroup = (properties.mask_adult !== 0 && properties.mask_child !== 0) ? `<div class="btn-group w-100 mb-1 border-middle">${btnAdult}${btnChild}</div>` : `<div class="btn-group w-100 mb-1">${btnAdult}${btnChild}</div>`;
        L.marker([geometry.coordinates[1], geometry.coordinates[0]], {
          icon: mask,
        }).addTo(osmMap).bindPopup(`
        <h2>${properties.name}</h2>
        <p class="m-0 mb-1"><a class="text-secondary" href='https://www.google.com.tw/maps/place/${properties.address}'>${properties.address}</a></p>
        <p class="m-0 mb-1 text-secondary">${properties.phone}</p>
        ${btnGroup}
        <p class="m-0 mb-1 text-secondary">最後更新時間：${properties.updated}</p>`);
      });
      // 加上 changeArea 是因為換地區後要直接打開該區域的第一間藥局
      vm.changeArea(pharmacies[0]);
    },
    removeMarker() {
      osmMap.eachLayer((layer) => {
        if (layer instanceof L.Marker) {
          osmMap.removeLayer(layer);
        }
      });
    },
    changeArea(pharmacy) {
      // 一開始進入網頁先呈現在彰社
      const vm = this;
      // 一旦切換地區，會前往該區的第一間藥局
      if (vm.isChanged) {
        osmMap.panTo([
          pharmacy.geometry.coordinates[1],
          pharmacy.geometry.coordinates[0],
        ]);
      }
      vm.isChanged = true;
    },
    updateSelect() {
      // 選取縣市之後，會將地區的值清空
      this.selected.area = '';
    },
    pento(pharmacy) {
      const { properties, geometry } = pharmacy;
      const x = geometry.coordinates[1];
      const y = geometry.coordinates[0];
      const mask = (properties.mask_adult === 0) ? greyIcon : blueIcon;
      const btnAdult = (properties.mask_adult === 0) ? '<button class="btn btn-lightGrey w-100 btn-adult">成人：已售完</button>' : `<button class="btn btn-mask w-100 btn-adult">成人：${properties.mask_adult} 個</button>`;
      const btnChild = (properties.mask_child === 0) ? '<button class="btn btn-lightGrey w-100 btn-child">兒童：已售完</button>' : `<button class="btn btn-mask w-100 btn-child">兒童：${properties.mask_child} 個</button>`;
      const btnGroup = (properties.mask_adult !== 0 && properties.mask_child !== 0) ? `<div class="btn-group w-100 mb-1 border-middle">${btnAdult}${btnChild}</div>` : `<div class="btn-group w-100 mb-1">${btnAdult}${btnChild}</div>`;
      // 直接點選左邊列表的藥局
      L.marker([x, y], { icon: mask }).addTo(osmMap).bindPopup(`<h2>${properties.name}</h2>
        <p class="m-0 mb-1"><a class="text-secondary" href='https://www.google.com.tw/maps/place/${properties.address}'>${properties.address}</a></p>
        <p class="m-0 mb-1 text-secondary">${properties.phone}</p>
        ${btnGroup}
        <p class="m-0 mb-1 text-secondary">最後更新時間：${properties.updated}</p>`).openPopup();
      osmMap.panTo([x, y]);
    },
  },
  mounted() {
    const vm = this;
    // API 路徑
    const api = 'https://raw.githubusercontent.com/kiang/pharmacies/master/json/points.json';
    this.$http.get(api).then((response) => {
      vm.data = response.data.features;
      vm.updateMap();
    });
    // 產生地圖
    osmMap = L.map('map', {
      center: [23.90536413, 120.6021661],
      zoom: 15,
    });
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png?{foo}', {
      foo: 'bar',
      attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>',
    }).addTo(osmMap);
  },
};
</script>

<style lang='scss'>
@import "./assets/scss/all";
// 右邊地圖
#map {
  height: 100vh;
}
// 左邊選單
.toolbox {
  height: 100vh;
  overflow-y: auto;
  background-color: #f6f6f6;
  .sticky-top {
    background-color: #f6f6f6;
    border-bottom: 3px solid #d3d3d3;
    box-shadow: 0 3px 10px rgba(0, 0, 0, 0.15);
  }
  a {
    cursor: pointer;
  }
  .list-group {
    .pharmacy-name {
      font-size: 18px;
      line-height: 27px;
      color: #333333;
      font-weight: bold;
    }
    .pharmacy-info {
      line-height: 24px;
      img {
        width: 14px;
        height: 14px;
      }
    }
    .btn-group {
      &.border-middle .btn-adult {
        border-right: 1px solid #fff;
      }
      &.border-middle .btn-child {
        border-left: 1px solid #fff;
      }
      & span {
        font-size: 14px;
        line-height: 20px;
      }
    }
  }
}
// Popup
.leaflet-popup-content-wrapper {
  border: 2px solid #668AFE;
  box-shadow: 0px 4px 16px #668AFE33;
  background: #fff;
  .leaflet-popup-content {
    font-family: "Noto Sans TC", "微軟正黑體", sans-serif;
    font-size: 1rem;
    background: #fff;
    h2 {
      font-size: 18px;
      line-height: 27px;
      color: #333333;
      font-weight: bold;
    }
    p {
      line-height: 24px;
    }
    .border-middle .btn-adult {
      border-right: 1px solid #fff;
    }
    .border-middle .btn-child {
      border-left: 1px solid #fff;
    }
  }
}
.leaflet-popup-tip-container {
  overflow: visible;
  .leaflet-popup-tip {
    border: 2px solid #668AFE;
    border-top: 0px solid #fff;
    border-left: 0px solid #fff;
    box-shadow: none;
    z-index: 9;
    margin: -9px auto 0;
  }
}
</style>
