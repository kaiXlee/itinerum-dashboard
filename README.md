## itinerum-dashboard

*This is a working document.*

This repository contains the ReactJS web dashboard for managing Itinerum surveys, web users and survey data. The repository is used in conjunction with the [itinerum-dashboard-api](https://gitlab.com/itinerum/itinerum-dashboard-api) repository for handling route responses.

##### Development Guide

The most important guideline is the `master` branch should always contain a working version of the application with appropriate unit tests. New features should be developed in a branch of the master named  as `feature-name-action`, for example: `survey-wizard-upsert-dropdown-options`.

Committing code should happen in the following order:

- Feature is developed or updated within its own named branch
- After all tests pass, feature is merged to `master` branch
- `master` branch is merged to `testing`, which tests and builds the Docker container on the CI server
- `testing` branch is merged to `staging` to deploy the image to AWS ECR
- Developer either checks out their feature branch to continue work, or returns to step 1 and creates a new branch

### Getting Started

#### Dependencies

Local development of the `itinerum-dashboard` requires NodeJS and npm. With these in place, install the javascript dependencies from the repository directory with:

```bash
$ npm install
```

#### Development

The Express server should work without configuration:

```bash
$ npm start
```

All new code should be contributed in branches with a naming similar to \<feature-name-action> such as *survey-wizard-conditional-logic*. When code is in a fully working and tested state, it is then merged in to the `master` branch.

#### Deployment

The `master` branch contains the latest version of the tested dashboard. When new contributions are ready to go live, the `master` branch is merged into the `testing` branch. The *testing* Gitlab-CI routine will build the Docker image and run the full suite of unittests. In the case of the web dashboard, a development version will be deployed to: [https://dashboard.testing.itinerum.ca](https://dashboard.testing.itinerum.ca). When all tests pass, the `master` branch can then pulled to the `production` branch.