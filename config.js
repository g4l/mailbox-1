mailBoxApp.config(function($stateProvider, $urlRouterProvider) {
        $stateProvider.state('home', {
                url: '/',
                component: 'home',
            })
            .state('home.mailbox', {
                url: 'mailbox/{mailboxId}',
                component: 'mailbox',
                resolve: {
                    mailbox: function(MailService, $stateParams) {
                        return MailService.getBox($stateParams.mailboxId);
                    },
                    title: function(MailService, $stateParams) {
                        return MailService.getTitle($stateParams.mailboxId);
                    },
                }
            })
            .state('home.mailbox.mail', {
                url: '/{mailId}',
                component: 'mail',
                resolve: {
                    mail: function(mailbox, $stateParams) {
                        return mailbox.find(function(mail) {
                            return mail._id === $stateParams.mailId;
                        })
                    }
                }
            })
            .state('home.userdetails', {
                url: 'users/details/{userId}',
                component: 'userdetails',
                resolve: {
                    user: function(UserService, $stateParams) {
                        return UserService.getUser($stateParams.userId);
                    }
                }
            })
            .state('home.useredit', {
                url: 'users/edit/{userId}',
                params: {
                    userId: {
                        value: null,
                        squash: true
                    }
                },
                component: 'useredit',
                resolve: {
                    user: function(UserService, $stateParams) {
                        if ($stateParams.userId === null) {
                            return {
                                "_id": null
                            };
                        }
                        return UserService.getUser($stateParams.userId);
                    }
                }
            })
            .state('auth', {
                url: '/auth',
                component: 'auth'
            })
        $urlRouterProvider.otherwise('/');
    })
    .run(($transitions, AuthService) => {
        $transitions.onEnter({
            to: '**'
        }, function($transition$, $state$) {
            let isAuthenticated = AuthService.isAuthenticated();
            let isAuthState = $state$.name === 'auth';

            if (!isAuthenticated && !isAuthState) {
                return $transition$.router.stateService.target('auth');
            }

            if (isAuthenticated && isAuthState) {
                return $transition$.router.stateService.target('home', {}, {
                    reload: true
                });
            }
        })
    })
