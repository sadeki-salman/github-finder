//Define UI Elements
let searchBtn = document.getElementById("searchBtn");
let searchUser = document.getElementById("searchUser");

// UI Class to Show User Profile
class UI {
    constructor() {
        this.profile = document.getElementById("profile");
    }

    //Show User Profile
    showProfile(user) {
        this.clearAlert();

        this.profile.innerHTML = `
        <div class="card card-body mb-3">
        <div class="row">
          <div class="col-md-3">
            <img class="img-fluid mb-2" src="${user.avatar_url}">
            <a href="${user.html_url}" target="_blank" class="btn btn-primary btn-block mb-4">View Profile</a>
          </div>
          <div class="col-md-9">
            <span class="badge badge-primary">Public Repos: ${user.public_repos}</span>
            <span class="badge badge-secondary">Public Gists: ${user.public_gists}</span>
            <span class="badge badge-success">Followers: ${user.followers}</span>
            <span class="badge badge-info">Following: ${user.following}</span>
            <br><br>
            <ul class="list-group">
              <li class="list-group-item">Name: ${user.name}</li>
              <li class="list-group-item">Company: ${user.company}</li>
              <li class="list-group-item">Website: ${user.blog}</li>
              <li class="list-group-item">Location: ${user.location}</li>
              <li class="list-group-item">Member Since: ${user.created_at}</li>
            </ul>
          </div>
        </div>
      </div>
        `;
    }

    //Clear Profile
    clearProfile() {
        this.profile.innerHTML = '';
    }

    //Show Alert
    showAlert(message, className) {
        this.clearAlert();
        this.clearProfile();

        let div = document.createElement("div");
        div.className = className;
        div.innerHTML = `${message}`;
        console.log(div);

        let container = document.querySelector(".searchContainer");
        let search = document.querySelector(".search");
        container.insertBefore(div, search);
    }
    //Clear Alert
    clearAlert() {
        let currentAlert = document.querySelector(".alert");
        if (currentAlert) {
            currentAlert.remove();
        }
    }
}

//UserRepo class to Show User Repositories
class UserRepo{
    constructor() {
        this.repos = document.getElementById("repos");
    }
    
    //Show Repositories
    showRepos(repoName, repoUrl){
        let div = document.createElement("div");
        div.className = 'm-2'
        let a = document.createElement("a");
        a.className = "btn btn-primary btn-block";
        a.href = `${repoUrl}`;
        a.innerHTML = `${repoName}`;
        a.target = '_blank';
        div.appendChild(a);
        this.repos.appendChild(div);
    }

    //Show Title
    showRepoTitle(name, number){
        let h4 = document.createElement("h4");
        h4.id = "repos-title"
        h4.innerHTML = `${name}'s Repositories`;
    
        
        let container = document.querySelector(".searchContainer");
        let repos = document.querySelector("#repos");

        container.insertBefore(h4, repos);
    }

    //Clear Repositories & Title
    clearRepos(){
        this.repos.innerHTML = '';
        document.querySelector("#repos-title")?.remove();
    }
}

//define class object
let ui = new UI();
let userRepo = new UserRepo();

//Fetch User Profile Information
searchBtn.addEventListener("click", (e) => {
    let userText = searchUser.value;

    if (userText != '') {
        //Fetch API
        fetch(`https://api.github.com/users/${userText}`).then(result => result.json()).then(data => {
            if(data.message == 'Not Found'){
                userRepo.clearRepos();
                //Show Alert
                ui.showAlert("User Not Found!", "alert alert-danger");
            }
            else{

                userRepo.clearRepos();
                //Show Profile
                ui.showProfile(data);
                
                //fetch user's repositories
                fetch(`https://api.github.com/users/${userText}/repos`).then(result => result.json()).then(repos => {
                    userRepo.showRepoTitle(data.name, data.public_repos);
                    for(let i in repos){

                        //show repositories
                        userRepo.showRepos(repos[i].name, repos[i].html_url)
                    }
                });
            }
        });
    }
    else{
        //Clear Profile & Title
        ui.clearProfile();
        userRepo.clearRepos();
    }
});