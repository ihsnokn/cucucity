const form = document.querySelector("section.top-banner form");
const input = document.querySelector(".container input");
const msg = document.querySelector("span.msg");
const list = document.querySelector(".ajax-section ul.cities");
const button = document.querySelector(".ajax");
const ul=document.querySelector(".cities");

const mykey = config.USER_KEY;
localStorage.setItem("tokenKey", mykey);



form.addEventListener("submit",(event)=>{
  console.log(mykey);
    event.preventDefault();
    getWeatherDataFromApi();
    getCities();

})


let select= ""
let response=""
let city=""


//* benim data
function getCities(){
    select= input.value.toLocaleLowerCase()
    console.log(select);

    const data=fetch("cities.json")
    .then(response=>response.json())
    .then(data=>{
    city=data.filter((item)=>{
       return item.name.toLocaleLowerCase()== select
        
    })
    console.log(city);
})

}


//Api Get func. (http methods == Verbs)
const getWeatherDataFromApi = async () => {
    //alert("http request is gone!");
    const tokenKey = localStorage.getItem("tokenKey");
    //alert(tokenKey);
    const inputValue = input.value;
    const units = "metric";
    const lang = "tr";
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${inputValue}&appid=${tokenKey}&units=${units}&lang=${lang}`;
  
    

    try {
      // const response = await fetch(url).then(response => response.json());
      response = await axios(url);
      console.log(response);
      //obj destr.
      const { main, weather, name} = response.data;
  
      const iconUrl = `http://openweathermap.org/img/wn/${weather[0].icon}@2x.png`;
      const iconUrlAWS = `https://s3-us-west-2.amazonaws.com/s.cdpn.io/162656/${weather[0].icon}.svg`;

      const cityNameSpans = list.querySelectorAll(".city span");
      const cityNameSpansArray = Array.from(cityNameSpans);
      if (cityNameSpansArray.length > 0) {
        const filteredArray = cityNameSpansArray.filter(
          (span) => span.innerText == name
        );
        if (filteredArray.length > 0) {
          msg.innerText = `You already know the weather for ${city[0].name}, Please search for another city 😉`;
          setTimeout(() => {
            msg.innerText = "";
          }, 5000);
          form.reset();
          return;
        }
      }
      //console.log(cityNameSpans);
      const createdLi = document.createElement("li");
      createdLi.classList.add("city");
      createdLi.innerHTML = `   <i id="trash" class="fa fa-trash" aria-hidden="true"></i>
                                <h2 class="city-name" data-name="${city[0].name}">
                                  <span>${city[0].name}</span>
                                </h2>
                                  <div class="city-temp">${city[0].numberPlate}</div>
                                  <div class="city-temp">${Math.round(
                                main.temp
                              )}<sup>°C</sup></div>
                              <figure>
                                  <img class="city-icon" src="${iconUrl}">
                                  <figcaption>${
                                    weather[0].description
                                  }</figcaption>
                              </figure>`;
      //append vs. prepend
      list.prepend(createdLi);
        
      let trash=document.getElementById("trash")
      function deleteUl() {
        trash=document.getElementById("trash")
        createdLi.remove();
      }
      console.log(trash);
      trash.addEventListener("click",deleteUl)
      
  
    } catch (error) {
      console.log(error);
      msg.innerText = `404 (City Not Found)`;
      setTimeout(() => {
        msg.innerText = "";
      }, 5000);
    }
    form.reset();

    
};



