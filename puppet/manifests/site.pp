stage { 'pre':
  before => Stage['main']
}

class { 'baseconfig':
  stage => 'pre'
}

class { 'nodejs':
  manage_repo => true,
  version => '0.10*'
}

package { 'grunt-cli':
  ensure   => present,
  provider => 'npm',
  require => Exec['npm_install_/vagrant/client:']
}

package { 'supervisor':
  ensure   => present,
  provider => 'npm',
  require => Exec['npm_install_/vagrant:']
}

nodejs::npm { '/vagrant:':
  ensure  => present,
  install_opt => '--no-bin-links',
  require => Class['nodejs'] 
}

nodejs::npm { '/vagrant/client:':
  ensure  => present,
  install_opt => '--no-bin-links',
  require => Class['nodejs']
}

exec { 'grunt source':
  command => 'grunt',
  path    => '/usr/bin/',
  cwd     => '/vagrant/client',
  require => Package['grunt-cli']
}

file { '/etc/init.d/project-run':
  owner => 'vagrant',
  group => 'vagrant',
  mode  => '0755',
  source => '/vagrant/scripts/service',
  require => Package['supervisor']
}

service { 'project-run':
  ensure    => running,
  enable    => true,
  name      => 'project-run',
  require => File['/etc/init.d/project-run']
}

include baseconfig, nodejs
