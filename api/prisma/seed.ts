
import { prisma } from "../lib/prisma";

async function main() {
  let user = await prisma.user.create({
      data: {
        username: "admin",
        password: "admin",
        email: "admin@hem.com",
        firstname: "Adam",
        lastname: "Inistrator",
        role: "ADMIN"
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
        role: "MANAGER"
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
        role: "USER"
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
            heuristics: {
              create: [
                { title: "#1: Visibility of System Status" },
                { title: "#2: Match Between the System and the Real World" },
                { title: "#3: User Control and Freedom" },
                { title: "#4: Consistency and Standards" },
                { title: "#5: Error Prevention" },
                { title: "#6: Recognition Rather than Recall" },
                { title: "#7: Flexibility and Efficiency of Use" },
                { title: "#8: Aesthetic and Minimalist Design" },
                { title: "#9: Help Users Recognize, Diagnose, and Recover from Errors" },
                { title: "#10: Help and Documentation" }
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
                { title: "catastrophic" },
                { title: "major" },
                { title: "minor" },
                { title: "cosmetic" },
                { title: "none" },
              ]
            }
          }
        }
      },
      include: {
        Findings: true,
        heuristicset: { include: { heuristics: true } }
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
    data: {heuristics: {connect: {id: project.heuristicset.heuristics[0].id}}}
  });
  await prisma.finding.update({
    where: {id: project.Findings[1].id},
    data: {heuristics: {connect: {id: project.heuristicset.heuristics[0].id}}}
  });
  await prisma.finding.update({
    where: {id: project.Findings[1].id},
    data: {heuristics: {connect: {id: project.heuristicset.heuristics[3].id}}}
  });
  await prisma.finding.update({
    where: {id: project.Findings[2].id},
    data: {heuristics: {connect: {id: project.heuristicset.heuristics[9].id}}}
  });
}

main();