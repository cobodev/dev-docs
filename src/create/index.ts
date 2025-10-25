import { Command } from "commander";

export const createCommand = new Command("create")
  .argument("[module]", "El módulo donde se creará la documentación")
  .argument("[title]", "El título de la documentación")
  .description("Crea un nuevo módulo de documentación")
  .action((module?: string, title?: string) => {
    if (!module || !title) {
      console.log("En este caso se pregunta por el modulo y el título");
    } else {
      console.log(`Módulo: ${module}, Título: ${title}`);
    }
});
