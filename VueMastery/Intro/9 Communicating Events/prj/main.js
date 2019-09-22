// https://medium.com/js-dojo/7-ways-to-define-a-component-template-in-vuejs-c04e0c72900d

// use template instead of el
Vue.component('product', {
    template: `
        <div class="product">
            <div class="product-image">
                <img v-bind:src="image" v-bind:alt="altText"/>
            </div>
            <div class="product-info">
                <h1>{{ title }}</h1>
    <!--            also see v-else-if and v-show-->
                <p v-if="inStock">In Stock</p>
                <p v-else>Out of Stock</p>
                <p>Shipping: {{shipping}}</p>
                <li v-for="detail in details">{{detail}}</li>
    <!--            key is optional but recommended, : is a short cut for v-bind:-->
                <div class="color-box"
                     v-for="variant, index in variants"
                     :key="variant.variantId"
                     :style="{backgroundColor: variant.variantColor}"
                     @mouseover="updateProduct(index)">
                </div>
                <button @click="addToCart"
                    :disabled="!inStock"
                    :class="{disabledButton: !inStock}">Add to Cart
                </button>
            </div>
        </div>`,
    // props are fields passed down from above
    props: {
        premium: {
            type: Boolean,
            required: true
        }
    },
    data() {
        return {
            product: "Socks",
            brand: "Vue Mastery",
            selectedVariant: 0,
            altText: "A pair of socks",
            details: ["80% cotton", "20% polyester", "Gender-Nuetral"],
            variants: [
                {
                    variantId: 2234,
                    variantColor: "green",
                    variantImage: "./assets/vmSocks-green-onWhite.jpg",
                    variantQuantity: 10
                },
                {
                    variantId: 2235,
                    variantColor: "blue",
                    variantImage: "./assets/vmSocks-blue-onWhite.jpg",
                    variantQuantity: 0
                },
            ],
        }
    },
    methods: {
        addToCart() {
            this.$emit('add-to-cart', this.variants[this.selectedVariant].variantId);
        },
        updateProduct(index) {
            this.selectedVariant = index;
            console.log(index);
        }
    },
    // use computed for data values they are cached so more performant than methods, make sure they don't have side effects'
    computed: {
        title() {
            return this.brand + ' ' + this.product;
        },
        image() {
            return this.variants[this.selectedVariant].variantImage;
        },
        inStock() {
            return this.variants[this.selectedVariant].variantQuantity;
        },
        shipping() {
            if (this.premium) {
                return "Free";
            } else {
                return 2.99;
            }
        }
    }
})

var app = new Vue({
    el: '#app',
    data: {
        premium: true,
        cart: []
    },
    methods: {
        updateCart(id) {
            this.cart.push(id)
        }
    }
})
