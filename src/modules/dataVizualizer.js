const { getData } = require("./postgreService"); //require("./dataStore.js");
const { addToBasket, getBasketItems } = require("./basketLogic.js");
const { getCurrentCategory } = require ("./sessionHelper.js");

let listProducts = async () => {
    let itemsInBasket = getBasketItems();

    let categoryId = getCurrentCategory();
    
    let data = await getData();
    let items = categoryId === 0 ? data : data.filter(item => item.categoryid === categoryId);
    
    let itemsContainer = document.getElementById("ItemsContainer");
    let children = itemsContainer.querySelectorAll('.item') || [];
    for(let i = 0 ; i < children.length; i ++){
        itemsContainer.removeChild(children[i]);
    }
    
    let itemTemplate = document.querySelector("#ItemTemplate").content;

    items.forEach(item => {
        let itemTemplateCopy = itemTemplate.cloneNode(true);
        itemTemplateCopy.querySelector(".item-name").textContent = item.name;
        itemTemplateCopy.querySelector(".item-description").textContent = item.description;
        itemTemplateCopy.querySelector(".item-image").setAttribute("src", getImagePath(item.image));
        
        let addToBasketButton = itemTemplateCopy.querySelector(".item__button");
        
        addToBasketButton.addEventListener("click", (event) => {
            addToBasket(item.id);
            event.currentTarget.textContent = "Added";
            event.currentTarget.classList.remove("item__button--primary");
            event.currentTarget.classList.add("item__button--added");
        });

        if(itemsInBasket.includes(item.id))
        {
            addToBasketButton.textContent = "Added";
            addToBasketButton.classList.remove("item__button--primary");
            addToBasketButton.classList.add("item__button--added");
        }

        itemsContainer.appendChild(itemTemplateCopy);
    });
}

let listBasketProducts = async () => {
    let itemsInBasket = getBasketItems();
    
    let data = await getData()
    let items = data.filter(item => itemsInBasket.includes(item.id));
    
    let itemsContainer = document.getElementById("ItemsContainer");
    let children = itemsContainer.querySelectorAll('.item') || [];
    for(let i = 0 ; i < children.length; i ++){
        itemsContainer.removeChild(children[i]);
    }
    
    let itemTemplate = document.querySelector("#ItemTemplate").content;

    items.forEach(item => {
        let itemTemplateCopy = itemTemplate.cloneNode(true);
        itemTemplateCopy.querySelector(".item-name").textContent = item.name;
        itemTemplateCopy.querySelector(".item-description").textContent = item.description;
        itemTemplateCopy.querySelector(".item-image").setAttribute("src", getImagePath(item.image));

        itemsContainer.appendChild(itemTemplateCopy);
    });
}

const getImagePath = imageName => `images/${imageName}`;

module.exports = {listProducts, listBasketProducts};