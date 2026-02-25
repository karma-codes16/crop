/* ============================= */
/* NORTHEAST LOCATION DATA */
/* ============================= */

const northeastData = {
  "Arunachal Pradesh": {
    "Tawang": ["Tawang Town", "Lumla"],
    "Itanagar": ["Naharlagun", "Doimukh"]
  },
  "Assam": {
    "Kamrup": ["Guwahati", "Dispur"],
    "Dibrugarh": ["Duliajan", "Naharkatia"]
  },
  "Manipur": {
    "Imphal West": ["Imphal", "Lamsang"]
  },
  "Meghalaya": {
    "East Khasi Hills": ["Shillong", "Mawphlang"]
  },
  "Mizoram": {
    "Aizawl": ["Aizawl City", "Durtlang"]
  },
  "Nagaland": {
    "Dimapur": ["Dimapur City", "Chumukedima"]
  },
  "Sikkim": {
    "East Sikkim": ["Gangtok", "Rangpo"],
    "West Sikkim": ["Gyalshing", "Pelling"]
  },
  "Tripura": {
    "West Tripura": ["Agartala", "Jirania"]
  }
};

/* ============================= */
/* DOM ELEMENTS */
/* ============================= */

const stateSelect = document.getElementById("stateSelect");
const districtSelect = document.getElementById("districtSelect");
const localitySelect = document.getElementById("localitySelect");
const stateSearch = document.getElementById("stateSearch");
const fetchBtn = document.getElementById("fetchClimate");
const loader = document.getElementById("locationLoader");

/* ============================= */
/* LOAD STATES */
/* ============================= */

function loadStates() {
  stateSelect.innerHTML = `<option value="">Select State</option>`;
  Object.keys(northeastData).forEach(state => {
    const option = document.createElement("option");
    option.value = state;
    option.textContent = state;
    stateSelect.appendChild(option);
  });
}
loadStates();

/* ============================= */
/* SEARCH STATE */
/* ============================= */

stateSearch.addEventListener("input", () => {
  const searchValue = stateSearch.value.toLowerCase();
  stateSelect.innerHTML = `<option value="">Select State</option>`;

  Object.keys(northeastData)
    .filter(state => state.toLowerCase().includes(searchValue))
    .forEach(state => {
      const option = document.createElement("option");
      option.value = state;
      option.textContent = state;
      stateSelect.appendChild(option);
    });
});

/* ============================= */
/* STATE CHANGE */
/* ============================= */

stateSelect.addEventListener("change", () => {
  districtSelect.disabled = false;
  districtSelect.innerHTML = `<option value="">Select District</option>`;
  localitySelect.innerHTML = `<option value="">Select Locality</option>`;
  localitySelect.disabled = true;

  const districts = northeastData[stateSelect.value];

  Object.keys(districts || {}).forEach(district => {
    const option = document.createElement("option");
    option.value = district;
    option.textContent = district;
    districtSelect.appendChild(option);
  });
});

/* ============================= */
/* DISTRICT CHANGE */
/* ============================= */

districtSelect.addEventListener("change", () => {
  localitySelect.disabled = false;
  localitySelect.innerHTML = `<option value="">Select Locality</option>`;

  const localities =
    northeastData[stateSelect.value][districtSelect.value] || [];

  localities.forEach(locality => {
    const option = document.createElement("option");
    option.value = locality;
    option.textContent = locality;
    localitySelect.appendChild(option);
  });
});

/* ============================= */
/* FETCH CLIMATE */
/* ============================= */

fetchBtn.addEventListener("click", async () => {

  const locality = localitySelect.value;

  if (!locality) {
    alert("Please complete location selection.");
    return;
  }

  fetchBtn.disabled = true;
  fetchBtn.innerText = "Fetching Climate...";
  loader.style.display = "block";

  try {

    const apiKey = "f4eece7f81ae4252e82a0e8d5ac9ac5f";
    const queryLocation = `${locality},IN`;

    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${queryLocation}&appid=${apiKey}&units=metric`
    );

    const data = await response.json();

    if (response.status !== 200) {
      throw new Error(data.message);
    }

    document.getElementById("temperature").value = data.main.temp;
    document.getElementById("humidity").value = data.main.humidity;
    document.getElementById("rainfall").value =
      data.rain && data.rain["1h"] ? data.rain["1h"] : 0;

  } catch (error) {
    alert("Climate data not available.");
    console.log("error");
  }

  loader.style.display = "none";
  fetchBtn.disabled = false;
  fetchBtn.innerText = "🔍 Fetch Climate Data";
});

/* ============================= */
/* POPUP SYSTEM */
/* ============================= */

const overlay = document.getElementById("resultOverlay");
const closeBtn = document.getElementById("closePopup");
const resultContent = document.getElementById("resultContent");

function openPopup(content) {
  resultContent.innerHTML = content;
  overlay.style.display = "flex";
}

function closePopup() {
  overlay.style.display = "none";
}

closeBtn.addEventListener("click", closePopup);

overlay.addEventListener("click", (e) => {
  if (e.target === overlay) closePopup();
});

/* ============================= */
/* AI RECOMMENDATION */
/* ============================= */

async function findCrop() {
  console.log("🔥 findCrop triggered");

  console.log("Find button clicked");

  const requestData = {
    state: document.getElementById("stateSelect").value,
    district: document.getElementById("districtSelect").value,
    locality: document.getElementById("localitySelect").value,
    temperature: document.getElementById("temperature").value,
    humidity: document.getElementById("humidity").value,
    rainfall: document.getElementById("rainfall").value,
    ph: document.getElementById("ph").value,
    soilType: document.getElementById("soilType").value
  };

  console.log("Sending Data:", requestData);

  try {

    const response = await fetch("/recommend", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(requestData)
    });

    const data = await response.json();

    console.log("Server Response:", data);

openPopup(`
  <h2>🌾 AI Recommendation</h2>
  <div style="text-align:left; white-space:pre-line;">
    ${data.result}
  </div>
`);

  } catch (error) {
    console.error(error);
    alert("Recommendation failed");
  }
}
console.log("JS Loaded");

const testBtn = document.getElementById("findRecommendation");
console.log("Button Found:", testBtn);

const findBtn = document.getElementById("findRecommendation");


findBtn.addEventListener("click", findCrop);
