exports.handler = async (event) => {
  const { NodeSSH } = require("node-ssh");
  const ssh = new NodeSSH();

  const pemfile = "./A4L.pem";
  const user = "ec2-user";
  const host = "44.197.76.136";

  let stdout = "";

  let cmd = "ls";

  const { command, cwd } = JSON.parse(event.body);
  console.log(command, cwd);
  if (!command || !cwd) {
    return {
      statusCode: 400,
      body: JSON.stringify("empty command/cwd"),
    };
  }

  cmd = command;

  try {
    const connection = await ssh.connect({
      host: host,
      username: user,
      privateKey: pemfile,
    });

    const result = await connection.execCommand(cmd, { cwd: cwd });

    if (result.stderr) {
      console.log("STDERR: " + result.stderr);
    }
    stdout = result.stdout;
    console.log("STDOUT: " + result.stdout);
  } catch (error) {
    console.error(error);
  }

  const response = {
    statusCode: 200,
    body: JSON.stringify(stdout),
  };
  return response;
};
