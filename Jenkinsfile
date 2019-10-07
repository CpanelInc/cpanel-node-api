#!/usr/bin/env groovy
@Library('cpanel-pipeline-library@master') _

node('docker') {
    def email = "scrum.phoenix@cpanel.net"
    def scmVars
    notify.emailAtEnd([to:email]) {
        stage('Setup') {
            scmVars = checkout scm
            // implied 'INPROGRESS' to Bitbucket
            notifyBitbucket commitSha1: scmVars.GIT_COMMIT
        }
        stage('Docker image build') {
            def registry_info = registry.getInfo()
            docker.withRegistry(registry_info.url, registry_info.credentialsId) {
                image = docker.build("phoenix/yarn:latest", "--pull --build-arg REGISTRY_HOST=${registry_info.host} .")
            }
        }
        image.inside {
            stage('yarn') {
                sh "yarn install"
                sh "yarn run build-docs"
            }
            stage('publish') {
                withCredentials([
                    sshUserPrivateKey(credentialsId: 'cpanel-npm',
                    keyFileVariable: 'KEY',
                    usernameVariable: 'USERNAME')
                ]) { sh "rsync -e 'ssh -o UserKnownHostsFile=/dev/null -o StrictHostKeyChecking=no -i $KEY' -v -zaP --delete --delete-excluded docs/ ${USERNAME}@docs.ui.dev.cpanel.net:public_html/api/" }
            }
        }
    }
}
