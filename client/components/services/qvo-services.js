import axios from "axios";

// Token unico de la app
const APITOKEN =
  "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJjb21tZXJjZV9pZCI6ImNvbV9TeHRoekZQd2Q0QmZsLU1XOTJSZm5BIiwiYXBpX3Rva2VuIjp0cnVlfQ.31nLRFenix9_X0qlt1ng-FUzicaFjSrkBvFAkMpiOkA";
const API_URL = "https://playground.qvo.cl";
// URL productiva de QVO, comentar o eliminar en desarrollo
// const API_URL = 'https://api.qvo.cl'

// Logs de consola activados o desactivados
const LOGS = true;

var qvoApi = axios.create({
  baseURL: API_URL,
  headers: {
    Authorization: `Bearer ${APITOKEN}`,
    "Content-Type": "application/json"
  }
});

const qvoService = {
  handleUserCardDelete: (customer_id, card_id) => {
    /* 
    Maneja la eliminación de la tarjeta de un usuario
    Req:  Requiere un id del cliente, y un id de la tarjeta 
    https://docs.qvo.cl/?javascript#eliminar-una-tarjeta
    */
    qvoApi
      .delete(`/customers/${customer_id}/cards/${card_id}`)
      .then(response => {
        return response;
      });
  },

  handleUserCardInscription: (customer_id, return_url) => {
    /*
    Maneja la inscripciòn de la tarjeta de un usuario
    Req: Requiere un id del cliente, y una url a retornar luego de webpay
    https://docs.qvo.cl/?javascript#crear-una-inscripcion-de-tarjeta
    */
    qvoApi
      .post(`/customers/${customer_id}/cards/inscriptions`, {
        return_url: return_url
      })
      .then(response => {
        location.replace(response.data.redirect_url);
      });
  },

  handleUserPlanSubscription: (customer_id, plan_id) => {
    /*
    Maneja la inscripción de un usuario a un plan
    Req: Requiere un id del cliente, y un id del plan,
    además que el cliente tenga un medio de pago activo
    
    Al momento de crear una suscripción, se cobrará automáticamente
    el costo del plan al medio de pago por defecto del cliente,
    a menos que el plan posea días de prueba, sea gratis (precio igual a 0)
    o tenga una fecha de inicio en el futuro.
    https://docs.qvo.cl/?javascript#crear-una-suscripcion
    */
    return new Promise((resolve, reject) => {
      // Obtiene al cliente
      qvoApi.get(`/customers/${customer_id}`).then(response => {
        // Verifica si el cliente tiene un metodo de pago predeterminado
        if (response.data.default_payment_method) {
          // Si tiene medio de pago, inicia la subscripción
          response.data.subscriptions.forEach(function(subscription) {
            qvoApi
              .delete(`/subscriptions/${subscription.id}`, {
                data: {
                  cancel_at_period_end: false // Este parametro cancela de inmediato la suscripcion
                }
              })
              .then(function(response) {
                resolve({ data: response.data });
              })
              .catch(function(error) {
                reject({ error: error.data });
              });
          });

          qvoApi
            .post("/subscriptions", {
              customer_id: customer_id,
              plan_id: plan_id
            })
            .then(response => {
              resolve({ data: response.data });
            })
            .catch(error => {});
        } else {
          // Si no tiene medio de pago, lo envía a inscribir una tarjeta
          qvoApi
            .post(`/customers/${customer_id}/cards/inscriptions`, {
              return_url: "http://localhost:3000/dashboard/plan"
            })
            .then(response => {
              location.replace(response.data.redirect_url);
            });
        }
      });
    }); // Fin promise
  },

  handleUserDesuscription: subscription_id => {
    /*
    Maneja la desuscripción de un usuario a un plan
    Req: Requiere un id de la subscripcion
    https://docs.qvo.cl/#cancelar-una-suscripcion
    */
    return new Promise((resolve, reject) => {
      qvoApi
        .delete(`/subscriptions/${subscription_id}`, {
          data: {
            cancel_at_period_end: false // Este parametro cancela de inmediato la suscripcion
          }
        })
        .then(function(response) {
          resolve({ data: response.data });
        })
        .catch(function(error) {
          reject({ error: error.data });
        });
    });
  },

  userIsClient: user_mail => {
    /*
    Busca en el registro de cliente y determina si el usuario con el
    mail pasado por parametros tiene un cliente o no
    Req: Requiere un email del cliente
    Devuelve: Un objeto Client o false
    */
    return new Promise((resolve, reject) => {
      qvoApi
        .get("/customers")
        .then(response => {
          var clients = response.data;
          var client = clients.find(client => client.email === user_mail);

          if (client) {
            resolve({ client: client });
          } else {
            reject({
              msg: "No existe un cliente con este mail",
              specification: response
            });
          }
        })
        .catch(response => {
          reject({
            msg: "No existe un cliente con este mail",
            specification: response
          });
        });
    });
  },

  getSubscription: () => {
    return new Promise((resolve, reject) => {
      qvoApi
        .get("/customers")
        .then(response => {
          var clients = response.data;
          const client = clients.find(client => client.email === user_mail);
          client
            ? resolve({ client: client })
            : reject({ msg: "No existe un cliente con este mail" });
        })
        .catch(response => {});
    });
  },

  handleUserInscription: (email, name) => {
    return new Promise((resolve, reject) => {
      qvoApi
        .post("/customers", {
          email: email,
          name: name
        })
        .then(response => {
          resolve({ client: response.data });
        })
        .catch(response => {
          reject({ msg: "Error", specification: response });
        });
    });
  },

  // Marketplace
  createAcount: () => {
    qvoApi
      .post("/accounts", {
        kind: "custom",
        custom_attributes: {
          email: "brucewayne@wayneenterprises.com",
          name: "Wayne Enterprises",
          phone: "1 6548 7946 1366"
        }
      })
      .then(function(response) {})
      .catch(function(response) {});
  },

  accountVerification: customer_id => {
    const company_certificate = fs.readFileSync("/pdf/company_certificate.pdf");
    const tax_certificate = fs.readFileSync("/pdf/tax_certificate.pdf");
    const legal_representative_id = fs.readFileSync(
      "/pdf/legal_representative_id.pdf"
    );

    qvoApi
      .post(`/accounts/${customer_id}/validations?=`, {
        company_certificate: {
          data: company_certificate,
          name: "company_certificate.pdf",
          type: "application.octet-stream"
        },
        ax_certificate: {
          data: ax_certificate,
          name: "ax_certificate.pdf",
          type: "application.octet-stream"
        },
        legal_representative_id: {
          data: legal_representative_id,
          name: "legal_representative_id.pdf",
          type: "application.octet-stream"
        }
      })
      .then(function(response) {});
  }
};

// Retorna el wrapper de QVO, ademas de la API preconfigurada via axios
export { qvoService, qvoApi };
