# -*- mode: ruby -*-
# vi: set ft=ruby :

Vagrant.configure("2") do |config|
  config.vm.box = "precise64"
  config.vm.box_url = "http://files.vagrantup.com/precise64.box"

  config.vm.network :forwarded_port, guest: 5000, host: 5001, auto_correct: true

  config.vm.provision :chef_solo do |chef|
    chef.cookbooks_path = "cookbooks"

    chef.add_recipe "apt"
    chef.add_recipe "build-essential"
    chef.add_recipe "ulimit"
    chef.add_recipe "openssl"
    chef.add_recipe "nodejs"
    chef.add_recipe "heroku-toolbelt"

    chef.json = {
      "nodejs" => {
        "version" => "0.10.15",
        "install_method" => "source",
        "npm" => "1.3.5"
      }
    }
  end
end
