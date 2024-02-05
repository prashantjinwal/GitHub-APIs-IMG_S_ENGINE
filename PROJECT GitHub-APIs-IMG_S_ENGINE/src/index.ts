const getUsename = document.querySelector("#user") as HTMLInputElement;
const formSubmit = document.querySelector("#form") as HTMLFormElement;
const main_container = document.querySelector(".main_container") as HTMLElement;


// so lets define the contract of object 

interface UserData {
    id:number;
    login:string;
    avatar_url : string;
    location:string;
    url:string;
}

// reusable fn

async function myCustomFetcher<T>(url:string, options?:RequestInit ):Promise<T> {
     const response = await fetch(url , options);
     if(!response.ok){
        throw new Error(`Network response was not ok - status: ${response.status}`);
     };
     
     const data = await response.json();
     console.log(data)
     return data;

}

//  lets display the card ui
const showResultUI = (singleUser:UserData) => {
    const {avatar_url ,login , url , location} = singleUser
    main_container.insertAdjacentHTML(
        "beforeend",
        `<div class ="card" >
        <img src = ${avatar_url} alt=${login} />
         <hr/>
         <div class = "card-footer">
         <img src="${avatar_url}" alt="${login}"  />
         <a herf = "${url}" >Github </a>
         </div>
         </div> `
    )

};

function fetchUserData (url:string){
    myCustomFetcher<UserData[]>(url, {}).then((userinfo) => {
        for(const singleUser of userinfo){
            showResultUI(singleUser);
            console.log("login" + singleUser.login);
        }
    });
}

// default fn call

fetchUserData("https://api.github.com/users");


// search funcationality

formSubmit.addEventListener('submit', async (e)=>{
   e.preventDefault();

   const searchTerm = getUsename.value.toLowerCase();
   try{

    const url = "https://api.github.com/users"

    const allUserData = await myCustomFetcher<UserData[]>(url,{});

    const matchingUsers = allUserData.filter((user)=>{
        return user.login.toLowerCase().startsWith(searchTerm); 
    })
// We need to clear previous data
    main_container.innerHTML = "";

    if(matchingUsers.length === 0){
        main_container?.insertAdjacentHTML(
            "beforeend",
            `<p class = "empty-msg" >No matching users found. </p>`
        )
    }else{
        for(const singleUser of matchingUsers){
            showResultUI(singleUser); 
        }
    }

   }catch(error){
    console.log(error);
   }
})
