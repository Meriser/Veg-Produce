// 1. 串接 API 資料
const url = "https://hexschool.github.io/js-filter-data/data.json";
let data = [];

async function getData() {
  try {
    await axios.get(url)
    .then((response) => {
      data = response.data;
      renderData(data);
    })
  }
  catch(error) {console.log(error)}
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
const buttonAll = document.querySelectorAll(".button-group button");

buttonGroup.addEventListener("click", (e) => {
  if (e.target.type == "button") {
    // 點擊切換 active
    buttonAll.forEach((btn) => btn.classList.remove("active"));
    e.target.classList.add("active");
    // 篩選代碼符合的資料
    let type = e.target.dataset.type;
    let filterData = data.filter((item) => item.種類代碼 === type);
    renderData(filterData);
    // 搜尋欄位清空    
    input.value = "";
  }
});

// 4. 搜尋資料
const search = document.querySelector(".search-group");
const input = document.querySelector("#crop");

function searchData() {
  let filterData = data.filter((item) => {
    // ⭐️ 過濾 API 部分作物名稱為 null 的資料
    return item.作物名稱 ? item.作物名稱.match(input.value.trim()) : null;
  });
  filterData.length === 0
    ? productList.innerHTML = `<tr><td colspan="6" class="text-center p-3">查無資訊QQ</td></tr>`
    : renderData(filterData);
}

search.addEventListener("click", (e) => {
  if (e.target.nodeName !== "BUTTON") return;
  if (input.value.trim() === "") {
    alert("請輸入搜尋內容");
    return;
  }
  searchData();
  // 搜尋資料後 buttonGroup 按鈕的 acitve class 移除 
  buttonAll.forEach((btn) => btn.classList.remove("active"));
});

// 5. 排序資料
const valueMap = {
  "依上價排序": "上價",
  "依中價排序": "中價",
  "依下價排序": "下價",
  "依平均價排序": "平均價",
  "依交易量排序": "交易量"
};
const select = document.querySelector("#js-select");

select.addEventListener("change", (e) => {
  const selectedValue = e.target.value;
  const selectedProperty = valueMap[selectedValue];
  if (selectedProperty) {
    data.sort((a, b) => b[selectedProperty] - a[selectedProperty]);
    searchData();
  }
});

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
    // 連動排序資料 
    select.value = valueMap[`依${sortPrice}排序`];
  }
});

// 優化建議：
// ✅ 使用搜尋功能後，buttonGroup 按鈕的 acitve class 可以移除
// ✅ 排序功能可以調整成根據當前資料做排序，例如搜尋"西瓜"之後，可以針對西瓜的資料做排序
// ✅ JS 第 47 - 49 行這段可以直接代入 type 篩選就好，不需寫 if，例如：data.filter((item) => item.種類代碼 === type )
// ✅ JS 第 59 行可以寫成 if (e.target.nodeName !== "BUTTON") return，不用包兩層 if
// ✅ select 預設的 option "排序篩選"可以加上 disabled 屬性，避免使用者點選
// ✅ 可嘗試將 sortAdvanced 和 select 的 option 做連動，例如當上價的箭頭被點擊，sortSelect.value 就調成 "上價"