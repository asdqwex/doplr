WARNING! This readme represents our dreams for the project. NONE OF THIS IS CURRENTLY SUPPORTED OR WORKING.


Doplr
==========
"A modern infrastructure platform to discover, render, monitor and automate servers and applications"

Composed of several utilities: `sweep` for discovery, `forecast` for visualization, the `radar` daemon for backgrounding these tasks, and `weathergirl` - a web service which allows access to sweep and a graphical forecast.

# Sweep

Sweep will be a command line utility for scanning cloud infrastructures. It will gather detailed server, network , device and other cloud service information. It will be able provide high level overviews of the entire environment and each individual component. It will also provide the json data that WeatherGirl will use to render web interface. Doplr's sweeps are powered by _floom_, the streaming infrastructure build system.

Doplr sweep will scan a host and add it to to doplr's "forecast". A forecast is a file which maps out what Doplr has seen so far. Doplr will automatically create a .forecast directory, and all sweeps will _append_ to the forecast. It is generally assumed you'd use distinct directories for distinct infrastructures.

    doplr sweep host myserver.com

Assuming you can SSH to myserver.com, doplr will add that host to the "forecast".

Doplr can also sweep entire cloud providers, doing all the hard work for you!

    doplr sweep aws AWS_SECRET_ID AWS_SECRET_KEY

We aim to support sweeping AWS, Google Cloud, Azure and OpenStack. Assuming you're sweeping a cloud, you don't need to deal with any other details or upkeep. If you're manually sweeping hosts, you might sometimes need to:

    doplr sweep host myserver.com --delete

To scan the entire forecast (all known elements in the infrastructure):

    doplr sweep --all

Note that while mass sweeps are parrellized as much as possible, they can still take a _long time_. By default Doplr's agent will not observe the host longer than it needs to (in the case of information collection, this is configurable via `--observefor NUM_SECONDS`, and defaults to 15 seconds). On production hosts, 15 seconds is typically more than enough time to gather meaningful date. Because sweeping often for brief periods of time is typically the best strategy, Doplr can easily be run in daemon mode:

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

By default doplr will simply use the current user to attempt to log into systems. Obviously, this is not typically desired or secure, particularly for a weathergirl server. There are two ways to accomplish this task: Bootstrap a dedicated SSH user, or install a doplr agent on the remote systems.

    doplr sweep host doplr@myserver.com -i somekey.pem

Doplr makes this easy to bootstrap:

    ssh-keygen ...
    doplr sweep ec2 --install-doplr-user -i ~/doplr.pem

# Speed

Under the hood, doplr uses _floom_. Because of this, doplr by default (like floom) simply uses SSH as a transport. However, floom supports _fireball mode_ - meaning that it will install an agent on the remote system which communicates without the SSH overhead. Doplr sweep can take care of this for you:

    doplr sweep ec2 --install-floom-agent

After that, doplr will remember each host which has the agent installed and attempt to communicate via a websocket on port 93105

Remember that all of this can be controlled via WeatherGirl!
