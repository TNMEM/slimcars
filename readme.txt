NOTES:

  *) Really two projects ...
    1-api of Slim php microframework with NotORM handling database PDO to mysql.
    2-frontend of html with jQuery javascript handling ajax calls.
      css by skeleton.css, normalize.css and very little custom css.

  *) $ rsync -avz --delete -e "ssh" --rsync-path="sudo rsync" . ubuntu@52.6.182.253:/opt/lampp/htdocs/apps/8085/
  
  Use this to update from remote project to production server using sudo with ubuntu login and certificate.
  Will require that the public key of remote Cloud9 server be put,
    into AWS production server at /home/ubuntu/.ssh/authorized_keys.
  Just copy and paste into it as last line with nano.
    Check that .ssh is chmod 700 and authorized_keys is chmod 600.

  *) Mount of sftp in Cloud9 depends on public key set as above note.
  
  *) $ composer require slim/slim "~2.0"
  
  Composer existed on remote project machine, this installed Slim microframework.
  It isn't needed to run on production machine with correct calls to autoloader.
  Also, could just download Slim microframework without composet at any rate.
  