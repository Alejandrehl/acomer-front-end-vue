import pkg from "./package";

export default {
    mode: "spa",

    /*
     ** Headers of the page
     */
    head: {
        title: pkg.name,
        meta: [
            { charset: "utf-8" },
            { name: "viewport", content: "width=device-width, initial-scale=1" },
            { hid: "description", name: "description", content: pkg.description }
        ],
        link: [{ rel: "icon", type: "image/x-icon", href: "/favicon.ico" }]
    },

    /*
     ** Customize the progress-bar color
     */
    loading: { color: "#fff" },

    /*
     ** Global CSS
     */
    css: ["~/assets/main.scss"],

    /*
     ** Plugins to load before mounting the App
     */
    plugins: ["~/plugins/gmap", "~/plugins/vmodal", '~/plugins/vue-swal', '~/plugins/lazyload'],

    /*
     ** Nuxt.js modules
     */
    modules: [
        "@nuxtjs/toast",
        "nuxt-fontawesome",
        "@nuxtjs/axios",
        "@nuxtjs/auth", ['@nuxtjs/google-analytics', {
            id: 'UA-144354552-1'
        }]
    ],

    auth: {
        strategies: {
            facebook: {
                client_id: "417862262321280",
                userinfo_endpoint: "https://graph.facebook.com/v2.12/me?fields=about,name,picture{url},email,birthday",
                scope: ["public_profile", "email", "user_birthday"]
            }
        }
    },

    fontawesome: {
        imports: [{
                set: "@fortawesome/free-solid-svg-icons",
                icons: ["fas"]
            },
            {
                set: "@fortawesome/free-brands-svg-icons",
                icons: ["fab"]
            }
        ]
    },

    toast: {
        position: "top-center",
        theme: "bubble",
        duration: 1000
    },

    /*
     ** Build configuration
     */
    build: {
        /*
         ** You can extend webpack config here
         */
        extend(config, ctx) {
            config.resolve.alias["vue"] = "vue/dist/vue.common";
        }
    }
};