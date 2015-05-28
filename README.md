# Doplr [![Circle CI](https://circleci.com/gh/asdqwex/doplr/tree/master.svg?style=svg)](https://circleci.com/gh/asdqwex/doplr/tree/master) [![Join the chat at https://gitter.im/asdqwex/doplr](https://badges.gitter.im/Join%20Chat.svg)](https://gitter.im/asdqwex/doplr?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge)
### The infrastructure discovery toolkit
[![Coverage Status](https://coveralls.io/repos/asdqwex/doplr/badge.svg?branch=master)](https://coveralls.io/r/asdqwex/doplr?branch=master) [![Code Climate](https://codeclimate.com/github/asdqwex/doplr/badges/gpa.svg)](https://codeclimate.com/github/asdqwex/doplr) [![Dependency Status](https://gemnasium.com/asdqwex/doplr.svg)](https://gemnasium.com/asdqwex/doplr) [![Stories in Ready](https://badge.waffle.io/asdqwex/doplr.svg?label=ready&title=Ready)](https://waffle.io/asdqwex/doplr)

[![NPM](https://nodei.co/npm/doplr.png?downloads=true&downloadRank=true&stars=true)](https://nodei.co/npm/doplr/)

**Doplr is written in ES6**, and as such requires a very up-to-date release of Node - Ensure you have the latest release at https://iojs.org

To use the CLI tool:

`sudo npm install -g doplr`

To use the library:

`npm install --save doplr`

Composed of several utilities: `sweep` for discovery, `forecast` for visualization, the `radar` daemon for backgrounding these tasks, and `weathergirl` - a web service which allows access to sweep and a graphical look at the `forecast`.

Doplr is built on top of _floom_, the streaming infrastructure build system. Doplr and floom aim to go hand in hand in tackling Javascript's final frontier - it has conquered the browser and the server - now it's time to take on infrastructure and operations.

# Sweep

Sweep is Doplr's discovery action. It is able to discover hosts, networks, and most importantly, cloud provider APIs. Doplr's sweeps are powered by _floom_, both for discovering hosts via a cloud providers API, as well as probing hosts themselves via SSH or floom's fireball daemon.

Information Doplr discovers is added to the **forecast**. A forecast is what Doplr calls the information it has collected so far. Running Doplr sweep will automatically create a .forecast directory, and all subsequent sweeps in that directory or any subdirectory will _append_ to that forecast. It is generally assumed you'd use distinct directories for distinct infrastructures (think git repositories). Like git, Doplr will search up the directory chain for a .forecast (exactly like git's behavior).

    doplr sweep host myserver.com

Assuming you can SSH to myserver.com, Doplr will add that host to the "forecast".

Doplr can also sweep entire cloud providers, doing all the hard work for you!

    doplr sweep aws AWS_SECRET_ID AWS_SECRET_KEY

We aim to support sweeping AWS, Google Cloud, Azure and OpenStack. Assuming you're sweeping a cloud, you don't need to deal with any other details or upkeep. If you're manually sweeping hosts, you might sometimes need to:

    doplr sweep host myserver.com --delete

To sweep the entire forecast (all known elements in the infrastructure):

    doplr sweep --all

Note that while sweeps can take a **long time**. By default Doplr's agent will not observe the host longer than it needs to (in the case of information collection, this is configurable via `--observefor NUM_SECONDS`, and defaults to 15 seconds). On production hosts, 15 seconds is typically more than enough time to gather meaningful date.

# Radar

Radar provides the ability to background and schedule sweeps via creating a daemon with an HTTP interface.

`doplr radar start` starts the daemon. Conversely, `doplr radar stop` and `doplr radar status` work as expected. Additionally, for automation purposes, `doplr radar status` will exit with a status of 0 when the service is running and 1 when it is not. Once backgrounded, sweeps can be sent to the background process: `doplr sweep ... --radar`. You can also queue a sweep of the entire known forecast with `doplr sweep --all --radar`.

## Scheduling

You can very easily schedule sweeps with the cron system using the commands above. However, you can also: `doplr sweep --all --radar --every 5m`
There will also be a config file that can be edited directly to tune these settings.

# Forecast

    doplr forecast

Doplr will report on its findings and give a summary of the state of the infrastructure as currently reported in the forecast file. Note that this action does not do a sweep! It simply generates reports from the current .forecast. Doplr forecast can be run in verbose mode: `doplr forecast -v` or you can specifically ask about a particular host or device: `doplr forecast myserver.com`.

# WeatherGirl

WeatherGirl is a pretty web interface which can browse the forecast and schedule and run sweeps.

    doplr weathergirl [--radar] [--port=90404]

Doplr will host WeatherGirl on port 90404. --radar will have the daemon host it. Conversely, you can start radar with WeatherGirl enabled to start with something like:

    doplr radar start --weathergirl --port=80 [--authentication=htpasswd]

WeatherGirl is able to perform all the other tasks in Doplr. The goal of this interface is to expose all major features of the doplr suite via a slick web UI. WeatherGirls end game goal would be to compete with Ubuntu's JuJu and entirely replace Graphite/Grafana.

# Security

By default Doplr will simply use the current user to attempt to log into systems. Obviously, this is not typically desired or secure, particularly for a weathergirl server. There are two ways to accomplish this task: Bootstrap a dedicated SSH user, or install a Doplr agent on the remote systems.

    doplr sweep host doplr@myserver.com -i somekey.pem

Doplr makes this easy to bootstrap:

    ssh-keygen ...
    doplr sweep ec2 --install-doplr-user -i ~/doplr.pem

# Speed

Under the hood, doplr uses _floom_. Because of this, doplr by default (like floom) simply uses SSH as a transport. However, floom supports _fireball mode_ - meaning that it will install an agent on the remote system which communicates without the SSH overhead. Doplr sweep can take care of this for you:

    doplr sweep ec2 --install-floom-agent

After that, Doplr will remember each host which has the agent installed and attempt to communicate via a websocket on port 93105

Remember that all of this can be controlled via WeatherGirl!
