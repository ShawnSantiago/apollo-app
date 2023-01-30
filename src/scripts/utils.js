import gsap from "gsap";

const cart =
  document.querySelector("cart-notification") ||
  document.querySelector("cart-drawer");

export const hover = (element) => {
  const hover = gsap.to(element, {
    opacity: 1,
    duration: 0.25,
    paused: true,
    ease: "ease-in-out",
  });

  element.addEventListener("mouseenter", () => hover.play());
  element.addEventListener("mouseleave", () => hover.reverse());
};
export const checkOutHandler = () => {
  const parts = partsList.getPartsData();

  const formData = {
    items: [],
    sections: cart.getSectionsToRender().map((section) => section.id),
  };
  parts.forEach((part) => {
    formData.items.push({
      id: part,
      quantity: 1,
    });
  });
  return formData;
};
export const addtocart = (formData) => {
  document.querySelector(".loading").classList.add("is-active");
  fetch(window.Shopify.routes.root + "cart/add.js", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(formData),
  })
    .then(async (response) => {
      const reader = await response.json();
      document.querySelector(".loading").classList.remove("is-active");
      cart.renderContents({
        ...reader.items[0],
        sections: reader.sections,
      });
    })
    .catch((error) => {
      console.error("Error:", error);
    })
    .finally(() => {
      if (cart && cart.classList.contains("is-empty"))
        cart.classList.remove("is-empty");
    });
};

export class PartsListController {
  constructor() {
    this.partsListData = this.partsListData = JSON.parse(
      localStorage.getItem("partsListData")
    );
  }
  getPartsData = () =>
    (this.partsListData = JSON.parse(localStorage.getItem("partsListData")));

  storeParts = (id) => {
    if (!this.partsListData) {
      this.partsListData = [id];
      localStorage.setItem("partsListData", JSON.stringify([id]));
      return;
    }
    if (this.partsListData.indexOf(id) > -1) return;
    this.partsListData.push(id);
    localStorage.setItem("partsListData", JSON.stringify(this.partsListData));
  };

  removePartsData = (id) => {
    if (!this.partsListData) return;
    this.partsListData = this.partsListData.filter((part) => part !== id);
    localStorage.setItem("partsListData", JSON.stringify(this.partsListData));
  };

  updatePartsList = () => {
    const partsList = document.querySelector(".parts-list ul");
    if (this.partsListData) {
      this.partsListData.forEach((part) => {
        const name = document
          .querySelector(`[data-id="${part}"]`)
          .getAttribute("data-name");
        this.addToPartsList(part, name);
      });
    }
  };

  addToPartsList = (id, name) => {
    const partsList = document.querySelector(".parts-list ul");
    const li = document.createElement("li");
    const removeButton = document.createElement("button");
    const a = document.createElement("a");

    if (partsList.parentNode.classList.contains("is-empty")) {
      partsList.parentNode.classList.remove("is-empty");
    } else {
      if (document.getElementById(`${id}`)) return;
    }
    this.storeParts(id);

    a.href = "https://apolloscooters.co/collections/spare-parts";
    a.target = "_blank";
    a.innerHTML = name;

    removeButton.innerHTML = "X";
    removeButton.classList.add("remove");
    removeButton.addEventListener("click", (e) => {
      e.target.parentNode.remove();
      this.removePartsData(id);
      if (partsList.children.length === 0) {
        partsList.parentNode.classList.add("is-empty");
      }
    });

    li.id = id;
    li.appendChild(a);
    li.appendChild(removeButton);
    partsList.appendChild(li);
  };
  checkOutHandler = () => {
    const parts = this.partsListData || this.getPartsData();

    const formData = {
      items: [],
      sections: cart.getSectionsToRender().map((section) => section.id),
    };
    parts.forEach((part) => {
      formData.items.push({
        id: part,
        quantity: 1,
      });
    });
    return formData;
  };
}
