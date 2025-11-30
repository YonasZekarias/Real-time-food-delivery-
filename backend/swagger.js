const swaggerAutogen = require("swagger-autogen")();

const doc = {
  info: {
    title: "Real-Time Food Delivery API",
    description: "API documentation for your food delivery app",
  },
  host: process.env.HOST || "localhost:5000", 
  schemes: ["http", "https"],                
};

const outputFile = "./swagger-output.json";
const endpointsFiles = ["./index.js"]; 

swaggerAutogen(outputFile, endpointsFiles, doc).then(() => {
  console.log("Swagger documentation generated successfully!");
});
