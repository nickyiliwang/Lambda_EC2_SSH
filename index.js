exports.handler = async (event) => {
  const fs = require("fs");
  const { NodeSSH } = require("node-ssh");
  const ssh = new NodeSSH();

  const pemfile = "./A4L.pem";
  const user = "ec2-user";
  const host = "44.197.76.136";

  let ourout = "";

  let cmd = "ls";
  if (event.cmd == "long") {
    cmd += " -l";
  }

  ssh
    .connect({
      host: host,
      username: user,
      privateKey: pemfile,
    })
    .then(() => {
      ssh.execCommand(cmd, { cwd: "/var" }).then(function (result) {
        ourout = result.stdout;
        console.log("STDOUT: " + result.stdout);
        console.log("STDERR: " + result.stderr);

        const response = {
          statusCode: 200,
          body: ourout,
        };
        return response;
      });
    });
};
