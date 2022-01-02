#!/bin/sh

run_as() {
    if [ "$(id -u)" = 0 ]; then
        su -p www-data -s /bin/sh -c "$1"
    else
        sh -c "$1"
    fi
}

run_as "php /var/www/html/occ config:system:set debug --value='true' --type=boolean"

run_as "php /var/www/html/occ app:enable sharerenamer"

run_as "php /var/www/html/occ migrations:migrate sharerenamer"

run_as "php /var/www/html/occ app:disable firstrunwizard"

run_as "php /var/www/html/occ config:system:set defaultapp --value='files'"

apache2-foreground