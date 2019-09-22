// https://medium.com/js-dojo/7-ways-to-define-a-component-template-in-vuejs-c04e0c72900d

var eventBus = new Vue();

Vue.component('product-tabs', {
    template: `
    <div>
        <div>
            <span class="tab" 
            v-for="(tab, index) in tabs" 
            @click="selectedTab = tab"
            :class="{activeTab: selectedTab === tab}">{{tab}}</span>
        </div>
        <div v-show="selectedTab === 'Reviews'">
            <p v-if="!reviews.length">There are no reviews yet</p>
            <ul v-else>
                <li v-for="(review, index) in reviews" :key="index">
                    <p>{{review.name}}</p>
                    <p>Rating: {{review.rating}}</p>
                    <p>{{review.review}}</p>
                </li>
            </ul>
        </div>
        <div v-show="selectedTab === 'Make a Review'">
            <product-review></product-review>
        </div>
    </div>
    `,
    data() {
        return {
            tabs: ['Reviews', 'Make a Review'],
            selectedTab: 'Reviews'
        }
    },
    props: {
        reviews: {
            type: Array,
            required: false
        }
    }
})

Vue.component('product-review', {
    template: `
<!--        <input v-model="name">-->
<!--prevent submit from re-loading page-->
        <form class="review-form" @submit.prevent="onSubmit">
        <p>
            <label for="name">Name:</label>
            <input id="name" v-model="name" placeholder="name">
        </p>
        <p>
            <label for="review">Review:</label>
            <textarea id="review" v-model="review"></textarea>
        </p>
        <p>
            <label for="rating">Rating:</label>
            <select id="rating" v-model.number="rating">
                <option>5</option>
                <option>4</option>
                <option>3</option>
                <option>2</option>
                <option>1</option>
            </select>
        </p>
        <p v-if:errors.length>
            <b>Please correct the followign error(s).</b>
            <ul>
                <li v-for="error in errors">{{error}}</li>
            </ul>
        </p>
        <p>
            <input type="submit" value="Submit">
        </p>
        </form>
    `,
    data() {
        return {
            name: null,
            review: null,
            rating: null,
            errors: []
        }
    },
    methods: {
        onSubmit() {
            if (this.name && this.rating && this.review) {
                let productReview = {
                    name: this.name,
                    review: this.review,
                    rating: this.rating
                }
                eventBus.$emit('review-submitted', productReview)
                // clear review form after submit
                this.name = null
                this.review = null
                this.rating = null
            } else {
                if (!this.name) this.errors.push("Name required.")
                if (!this.review) this.errors.push("Review required.")
                if (!this.rating) this.errors.push("Rating required.")
            }
        }
    }
})

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
            <div>
                <product-tabs :reviews="reviews"></product-tabs>
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
            reviews: []
        }
    },
    methods: {
        addToCart() {
            this.$emit('add-to-cart', this.variants[this.selectedVariant].variantId);
        },
        updateProduct(index) {
            this.selectedVariant = index;
            console.log(index);
        },
        // moved to mounted
        // addReview(productReview) {
        //     this.reviews.push(productReview);
        // }
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
    },
    mounted() {
        eventBus.$on('review-submitted', productReview => {
            this.reviews.push(productReview)
        })
    },
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
