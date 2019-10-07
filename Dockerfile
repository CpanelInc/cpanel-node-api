## defaults that will intentionally fail unless you pass good values in
ARG REGISTRY_HOST=dorkus.malorkus.net
FROM centos:7
LABEL maintainer="Pax Aurora"

RUN yum -y update \
    && yum install -y sudo openssh-clients rsync \
    && curl --silent --location https://rpm.nodesource.com/setup_10.x | sudo bash - \
    && curl --silent --location https://dl.yarnpkg.com/rpm/yarn.repo | sudo tee /etc/yum.repos.d/yarn.repo \
    && yum install -y nodejs yarn \
    && yum clean all \
    && rm -rf /var/cache/yum

RUN echo -e 'Defaults:jenkins !requiretty\njenkins ALL=(ALL) NOPASSWD:ALL' >/etc/sudoers.d/jenkins \
    && groupadd --gid 1008 jenkins \
    && useradd --uid 1008 --gid 1008 --comment "User to match the host user id" jenkins

USER jenkins
