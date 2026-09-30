import {projectService} from "./project.service";

async function getReportLatex(id: string, user: any): Promise<any> {
  const project= await projectService.getById(id, user);
  return "\\documentclass[11pt]{scrartcl}\n" +
    " \n" +
    " \n" +
    " \n" +
    "\\begin{document}\n" +
    " \n" +
    " \\section{" + project.title + "}\n" +
    " \n" +
    "\\end{document}";
}

export const exportService = {
  getReportLatex
};
