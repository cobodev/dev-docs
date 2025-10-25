import { Command } from "commander";

export const initCommand = new Command("init")
  .description("Inicializa la estructura base de documentación")
  .action(() => {
    console.log("hola hola adios")
});
