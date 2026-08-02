
import { prisma } from "../lib/prisma";

async function main() {
  const adminrole = await prisma.role.create({
    data: {
      title: "Administrator",
      description: "All privileges",
      order: 0,
      userAdd: true,
      userEdit: true,
      projectAdd: true,
      projectViewAll: true,
      projectEditAll: true,
      heuristicSetEdit: true,
      ratingSetEdit: true,
      statusEdit: true
    }
  });

  const managerrole = await prisma.role.create({
    data: {
      title: "Manager",
      description: "Can add users and projects, and view all porejcts",
      order: 1,
      userAdd: true,
      projectAdd: true,
      projectViewAll: true,
    }
  });

  const userrole = await prisma.role.create({
    data: {
      title: "Simple user",
      description: "No system privileges",
      order: 2,
    }
  });

  let user = await prisma.user.create({
      data: {
        username: "admin",
        password: "admin",
        email: "admin@hem.com",
        firstname: "Adam",
        lastname: "Inistrator",
        roleId: adminrole.id
      },
    }
  );

  let user2 = await prisma.user.create({
      data: {
        username: "manager",
        password: "manager",
        email: "man.ager@hem.com",
        firstname: "Manuel",
        lastname: "Ager",
        roleId: managerrole.id
      },
    }
  );

  let user3 = await prisma.user.create({
      data: {
        username: "eval",
        password: "eval",
        email: "eval@hem.com",
        firstname: "Eva",
        lastname: "Luator",
        roleId: userrole.id
      },
    }
  );


  const statuses = await prisma.status.createMany({
    data: [
      {title: "Draft"},
      {title: "Preparing"},
      {title: "Evaluating"},
      {title: "Manager Review"},
      {title: "Severity Rating"},
      {title: "Concluding"},
      {title: "Finished"},
    ]
  })

  const status = await prisma.status.findFirst({
    where: { title: "Preparing" }
  });

  let project = await prisma.project.create({
    data: {
      title: "Evaluation of tugraz.at",
      description: "This is an evaluation example of the website tugraz.at",
      status: { connect: { id: status.id } },
      Findings: {
          create: [
            {
              user: { connect: { id: user2.id } },
              title: "Video on the Start Page",
              description: "The start page has a muted video that starts automatically."
            },
            {
              user: { connect: { id: user2.id } },
              title: "Some bad things",
              description: "I don't like this..."
            },
            {
              user: { connect: { id: user3.id } },
              title: "Perfect",
              description: "The page is fine."
            }
          ]
        },
        heuristicset : {
          create: {
            // https://www.nngroup.com/articles/ten-usability-heuristics/
            title: "Nielsen's 10 Usability Heuristics",
            description: " Jakob Nielsen's 10 general principles for interaction design. They are called \"heuristics\" because they are broad rules of thumb and not specific usability guidelines.",
            heuristics: {
              create: [
                {
                  title: "#1: Visibility of System Status",
                  color: "#3c74b2", textcolor: "white",
                  description: "The design should always keep users informed about what is going on, through appropriate feedback within a reasonable amount of time."
                },
                {
                  title: "#2: Match Between the System and the Real World",
                  color: "#00a790", textcolor: "white",
                  description: "The design should speak the users' language. Use words, phrases, and concepts familiar to the user, rather than internal jargon. Follow real-world conventions, making information appear in a natural and logical order."
                },
                {
                  title: "#3: User Control and Freedom",
                  color: "#b0247b", textcolor: "white",
                  description: "Users often perform actions by mistake. They need a clearly marked \"emergency exit\" to leave the unwanted action without having to go through an extended process."
                },
                {
                  title: "#4: Consistency and Standards",
                  color: "#e61c4b", textcolor: "white",
                  description: "Users should not have to wonder whether different words, situations, or actions mean the same thing. Follow platform and industry conventions."
                },
                {
                  title: "#5: Error Prevention",
                  color: "#c75428", textcolor: "white",
                  description: "Good error messages are important, but the best designs carefully prevent problems from occurring in the first place. Either eliminate error-prone conditions, or check for them and present users with a confirmation option before they commit to the action."
                },
                {
                  title: "#6: Recognition Rather than Recall",
                  color: "#638138", textcolor: "white",
                  description: "Minimize the user's memory load by making elements, actions, and options visible. The user should not have to remember information from one part of the interface to another. Information required to use the design (e.g. field labels or menu items) should be visible or"
                },
                {
                  title: "#7: Flexibility and Efficiency of Use",
                  color: "#e72128", textcolor: "white",
                  description: "Shortcuts — hidden from novice users — may speed up the interaction for the expert user so that the design can cater to both inexperienced and experienced users. Allow users to tailor frequent actions."
                },
                {
                  title: "#8: Aesthetic and Minimalist Design",
                  color: "#96702a", textcolor: "white",
                  description: "Interfaces should not contain information that is irrelevant or rarely needed. Every extra unit of information in an interface competes with the relevant units of information and diminishes their relative visibility."
                },
                {
                  title: "#9: Help Users Recognize, Diagnose, and Recover from Errors",
                  color: "#1d8293", textcolor: "white",
                  description: "Error messages should be expressed in plain language (no error codes), precisely indicate the problem, and constructively suggest a solution."
                },
                {
                  title: "#10: Help and Documentation",
                  color: "#716fb3", textcolor: "white",
                  description: "It’s best if the system doesn’t need any additional explanation. However, it may be necessary to provide documentation to help users understand how to complete their tasks."
                }
              ]
            }
          }
        },
        severityset : {
          create: {
            // https://courses.isds.tugraz.at/hci/hci.pdf
            title: "Andrews' Severity Rating",
            severities: {
              create: [
                { title: "Catastrophic Problem", color: "red", textcolor: "white" },
                { title: "Major Problem", color: "orange", textcolor: "white" },
                { title: "Minor Problem", color: "#87cefa", textcolor: "white" },
                { title: "Cosmetic Problem only", color: "lightgreen", textcolor: "white" },
                { title: "Not a Problem at all", color: "darkgreen", textcolor: "white" },
              ]
            }
          }
        }
      },
      include: {
        Findings: true,
        heuristicset: { include: { heuristics: true } },
        severityset: { include: { severities: true } }
      }
    },
  );

  // Add users to the project
  let uip = await prisma.userInProject.createMany({
    data: [
      {
        userId: user2.id,
        projectId: project.id,
        projectRole: "MANAGER"
      },
      {
        userId: user3.id,
        projectId: project.id,
        projectRole: "MEMBER"
      }
    ]
  })

  // Add heuristics to findings
  await prisma.finding.update({
    where: {id: project.Findings[0].id},
    data: {
      heuristics: {connect: {id: project.heuristicset.heuristics[0].id}},
      severity: {connect: {id: project.severityset.severities[1].id}}
    }
  });
  await prisma.finding.update({
    where: {id: project.Findings[1].id},
    data: {
      heuristics: {connect: {id: project.heuristicset.heuristics[0].id}},
      severity: {connect: {id: project.severityset.severities[2].id}}
    }
  });
  await prisma.finding.update({
    where: {id: project.Findings[1].id},
    data: {
      heuristics: {connect: {id: project.heuristicset.heuristics[3].id}},
      severity: {connect: {id: project.severityset.severities[0].id}}
    }
  });
  await prisma.finding.update({
    where: {id: project.Findings[2].id},
    data: {
      heuristics: {connect: {id: project.heuristicset.heuristics[9].id}},
      severity: {connect: {id: project.severityset.severities[2].id}}
    }
  });
}

main();