import {PartsListController, addtocart, hover} from "./utils";

const App = () => {
  const partsList = new PartsListController();
  partsList.updatePartsList(true);

  const components = document.querySelectorAll(".component");
  components.forEach((component) => {
    hover(component);
    component.addEventListener(
      "click",
      (e) => {
        const SVGparent = e.target.closest("svg");
        const id = SVGparent.getAttribute("data-id");
        const name = SVGparent.getAttribute("data-name");
        partsList.addToPartsList(id, name);
      },
      false
    );
  });

  const checkout = document.querySelector(".product-interactive .checkout");
  checkout.addEventListener("click", (e) => {
    e.preventDefault();
    addtocart(partsList.checkOutHandler());
  });
};

export default App;
