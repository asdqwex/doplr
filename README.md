# Doplr [![Circle CI](https://circleci.com/gh/asdqwex/doplr/tree/master.svg?style=svg)](https://circleci.com/gh/asdqwex/doplr/tree/master) [![Join the chat at https://gitter.im/asdqwex/doplr](https://badges.gitter.im/Join%20Chat.svg)](https://gitter.im/asdqwex/doplr?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge)
### The infrastructure discovery toolkit
[![Code Climate](https://codeclimate.com/github/asdqwex/doplr/badges/gpa.svg)](https://codeclimate.com/github/asdqwex/doplr) [![Dependency Status](https://gemnasium.com/asdqwex/doplr.svg)](https://gemnasium.com/asdqwex/doplr) [![Stories in Ready](https://badge.waffle.io/asdqwex/doplr.svg?label=ready&title=Ready)](https://waffle.io/asdqwex/doplr)

**Doplr is written in ES6**, and as such requires a very up-to-date release of Node - Ensure you have the latest release at https://iojs.org

To use the CLI tool:

`sudo npm install -g doplr`

To use the library:

`npm install --save doplr`

Composed of several utilities: `sweep` for discovery, `forecast` for visualization and `radar` - an API which allows access to the data descovered by doplr.

## The Weather

Information Doplr discovers is added to the **weather** database, which is powered by LevelDB. Doplr will ask you if you'd like to create a new .weather directory if it cannot find one in your path.

# Sweep

Sweep is Doplr's discovery action. It is able to discover hosts, networks, and most importantly, cloud provider APIs.

    doplr sweep host examplehost

Doplr will use whatever plugins it has to collect information about "examplehost" and add this information to the weather database!

Doplr can also sweep entire cloud providers, doing all the hard work for you!

    doplr sweep aws AWS_SECRET_ID AWS_SECRET_KEY

To sweep the entire forecast (all known elements in the infrastructure):

    doplr sweep

# Forecast

    doplr forecast

Doplr `forecast` is a reporting tool - a CLI version is planned, but for now it is web-browser only. It'll be worth it though!

# Radar

    doplr radar

Radar provides the ability to background and schedule sweeps via an HTTP interface. `doplr forecast` automatically launches a radar server for it to communicate with, so unless you're setting up a dedicated `doplr radar` server, this isn't very useful.

# Security

By default Doplr will simply use the current user to attempt to log into systems. Obviously, this is not typically desired or secure, particularly for a Radar server. There are two ways to accomplish this task: Bootstrap a dedicated SSH user, or install a Doplr agent on the remote systems.

    doplr sweep host doplr@myserver.com -i somekey.pem

Doplr makes this easy to bootstrap:

    ssh-keygen ...
    doplr sweep ec2 --install-doplr-user -i ~/doplr.pem
