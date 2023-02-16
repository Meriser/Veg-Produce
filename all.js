// 1. 串接 API 資料
const url = "https://hexschool.github.io/js-filter-data/data.json";
let data = [];

function getData() {
  axios
    .get(url)
    .then((response) => {
      data = response.data;
      renderData(data);
    })
    .catch((error) => console.log(error));
}
getData();

// 2. 渲染資料
const productList = document.querySelector(".showList");

function renderData(showData) {
  let str = "";
  showData.forEach((item) => {
    str += `<tr>
    <td>${item.作物名稱}</td>
    <td>${item.市場名稱}</td>
    <td>${item.上價}</td>
    <td>${item.中價}</td>
    <td>${item.下價}</td>
    <td>${item.平均價}</td>
    <td>${item.交易量}</td>
    </tr>`;
  });
  productList.innerHTML = str;
}

// 3. 篩選資料
const buttonGroup = document.querySelector(".button-group");

buttonGroup.addEventListener("click", (e) => {
  if (e.target.type == "button") {
    // 點擊切換 active
    let buttonAll = document.querySelectorAll(".button-group button");
    buttonAll.forEach((btn) => btn.classList.remove("active"));
    e.target.classList.add("active");
    // 篩選代碼符合的資料
    let type = e.target.dataset.type;
    let filterData = [];
    if      (type == "N04") filterData = data.filter((item) => item.種類代碼 == "N04");
    else if (type == "N05") filterData = data.filter((item) => item.種類代碼 == "N05");
    else if (type == "N06") filterData = data.filter((item) => item.種類代碼 == "N06");
    renderData(filterData);
  }
});

// 4. 搜尋資料
const search = document.querySelector(".search-group");
const input = document.querySelector("#crop");

search.addEventListener("click", (e) => {
  if (e.target.nodeName === "BUTTON") {
    if (input.value.trim() === "") {
      alert("請輸入搜尋內容");
      return;
    }
    let filterData = [];
    filterData = data.filter(item => {
      // ⭐️ 過濾 API 部分作物名稱為 null 的資料
      return item.作物名稱 ? item.作物名稱.match(input.value.trim()) : null;
    });
    filterData.length === 0
      ? productList.innerHTML = `<tr><td colspan="6" class="text-center p-3">查無資訊QQ</td></tr>`
      : renderData(filterData);
    input.value = "";
  }
});

// 5. 排序資料
const select = document.querySelector("#js-select");

select.addEventListener("change", (e) => {
  const valueMap = {
    "依上價排序": "上價",
    "依中價排序": "中價",
    "依下價排序": "下價",
    "依平均價排序": "平均價",
    "依交易量排序": "交易量"
  };
  const selectedValue = e.target.value;
  const selectedProperty = valueMap[selectedValue];
  if (selectedProperty) {
    data.sort((a, b) => a[selectedProperty] - b[selectedProperty]);
    renderData(data);
  }
});

// switch 寫法 (排序資料)
// select.addEventListener("change", (e) => {
//   function selectChange(value) {
//     data.sort((a, b) => a[value] - b[value]);
//     renderData(data);
//   }
//   switch (e.target.value) {
//     case "依上價排序":
//       selectChange("上價");
//       break;
//     case "依中價排序":
//       selectChange("中價");
//       break;
//     case "依下價排序":
//       selectChange("下價");
//       break;
//     case "依平均價排序":
//       selectChange("平均價");
//       break;
//     case "依交易量排序":
//       selectChange("交易量");
//       break;
//   }
// });

// 6. 點擊箭頭 排序資料
const sortAdvanced = document.querySelector(".js-sort-advanced");

sortAdvanced.addEventListener("click", (e) => {
  if (e.target.nodeName === "I") {
    const sortPrice = e.target.dataset.price;
    const sortCaret = e.target.dataset.sort;
    sortCaret === "up"
      ? data.sort((a, b) => b[sortPrice] - a[sortPrice])
      : data.sort((a, b) => a[sortPrice] - b[sortPrice]);
    renderData(data);
  }
});
