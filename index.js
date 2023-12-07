import items from "./data.js"

const getEl = (str) => document.querySelector(str)
const orderSection = getEl(".order-section")
const menuSection = getEl(".menu-section")
const totalSection = getEl(".total-section")
const totalSpan = getEl(".total-span")
const orderBtn = getEl(".order-btn")
const soloH5 = getEl(".solo-h5")
const paymentModal = getEl(".payment-modal")
function renderMenuItems(arr) {
  const menuItems = arr
    .map((item) => {
      // We add a cost property that will be used to track the total cost of each individual item in the order and a count as well that will track and display quantity of each item ordere
      item.cost = 0
      item.count = 0
      const { name, ingredients, id, price, emoji } = item
      return `
            <div class="item-div">
                <span class="emoji">${emoji}</span>
                <h5 class="name">${name}</h5>
                <span class="ingredients">${ingredients.join(", ")}</span>
                <span class="price">$${price}</span>
                <i class="fa-regular fa-plus fa-xs" data-id=${id}></i>  
            </div>
            `
    })
    .join("")

  return menuItems
}
menuSection.innerHTML = renderMenuItems(items)

let pendingItems = []

const plusIcons = document.querySelectorAll(".fa-plus")

plusIcons.forEach((icon) => {
  icon.addEventListener("click", (e) => {
    // now we use the data-id we added to get the whole item object
    const menuItem = items[e.target.dataset.id]

    const updatedItems = checkForMenuItem(pendingItems, menuItem)
    if (updatedItems.length) {
      soloH5.classList.remove("hidden")
      orderSection.classList.remove("hidden")
      totalSection.classList.remove("hidden")
    }
    renderPendingOrder(updatedItems)

    totalSpan.textContent = `$${totalCostFunc(updatedItems)}`
  })
})

// this will keep track of pendingItems
function checkForMenuItem(arr, thing) {
  const existingItem = arr.find((obj) => obj.name === thing.name)

  if (existingItem) {
    thing.cost += thing.price
    thing.count += 1
  } else {
    thing.cost = thing.price
    thing.count = 1
    arr.push(thing)
  }
  return arr
}

// show current items that user has on their order
function renderPendingOrder(arr) {
  let pendingOrder = arr
    .map((foodObject) => {
      return `
         <div class="order-div">
             <p class="food-name">${foodObject.name}</p>
             <span class="remove-span" data-price=${foodObject.price} data-id=${foodObject.id} data-cost=${foodObject.cost} data-count=${foodObject.count}>remove</span>
             <span class="count-span">(${foodObject.count}) -- </span>
             <span class="cost-span">$${foodObject.cost}</span>
         </div>
     `
    })
    .join("")
  orderSection.innerHTML = pendingOrder
  const removeSpans = orderSection.querySelectorAll(".remove-span")
  removeSpans.forEach((span) => {
    span.addEventListener("click", (e) => {
      const itemPrice = parseInt(e.target.dataset.price)
      const itemId = parseInt(e.target.dataset.id)
      const itemCost = parseInt(e.target.dataset.cost)
      const itemCount = parseInt(e.target.dataset.count)
      // Subtract the item's price from its cost

      const updatedCost = Number(itemCost - itemPrice)
      const updatedCount = Number(itemCount - 1)
      console.log(updatedCount)

      // Find the item in the updatedItems array and update its cost
      const itemToUpdate = arr.find((obj) => obj.id === itemId)
      if (itemToUpdate) {
        itemToUpdate.cost = updatedCost
        itemToUpdate.count = updatedCount
      }

      // Remove items with cost <= 0
      arr = arr.filter((obj) => obj.cost > 0)
      // THIS TOOK FOREVER FOR ME TO DEBUG!!!!!!!!!!!!!!!!!!!!!! I only had been filtering the updatedItems array, and not pendingItems. But updatedItems is dependent on pendingItems. And it needs to be filtered!
      pendingItems = pendingItems.filter((obj) => obj.cost > 0)

      // Update the total cost

      let totalCost = totalCostFunc(pendingItems)

      console.log(totalCost)
      totalSpan.textContent = `$${totalCost}`
      if (totalCost <= 0) {
        //totalSection.classList("hidden")
        soloH5.classList.add("hidden")
        orderSection.classList.add("hidden")
        totalSection.classList.add("hidden")
      }
      // Re-render the order section
      renderPendingOrder(arr)
    })
  })

  return orderSection
}

function totalCostFunc(arr) {
  return arr.reduce((total, curr) => (total += curr.cost), 0)
}

// submitting order and payment
orderBtn.addEventListener("click", () => {
  paymentModal.classList.remove("hidden")
  document.querySelector(".main-container").classList.add("background-change")
  console.log("clicked")
})
paymentModal.addEventListener("submit", function (e) {
  e.preventDefault()
  const nameInput = document.getElementById("name-input").value
  document
    .querySelector(".main-container")
    .classList.remove("background-change")
  paymentModal.classList.add("hidden")
  orderSection.classList.add("hidden")
  soloH5.classList.add("hidden")
  totalSection.classList.add("hidden")
  const thankYouDiv = document.createElement("div")
  thankYouDiv.textContent = `Thanks ${nameInput}! Your order is on the way`
  thankYouDiv.classList.add("thank-you")
  menuSection.append(thankYouDiv)
})
