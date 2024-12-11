document.addEventListener('DOMContentLoaded', function() {
    // Kullanıcı verilerini localStorage'dan al
    const users = JSON.parse(localStorage.getItem('users')) || [];
    
    // Sabit yönetici bilgileri
    const ADMIN_USERS = [
        { username: 'AbdulvahabDemir', password: '0202' },
        { username: 'HasanAkkaya', password: '4646' }
    ];

    // Giriş sayfasındaysak
    if (window.location.pathname.endsWith('login.html')) {
        const loginForm = document.getElementById('loginForm');
        const registerForm = document.getElementById('registerForm');
        const forgotPasswordForm = document.getElementById('forgotPasswordForm');
        const loginBox = document.getElementById('loginBox');
        const registerBox = document.getElementById('registerBox');
        const forgotPasswordBox = document.getElementById('forgotPasswordBox');
        const showRegisterLink = document.getElementById('showRegister');
        const showLoginLink = document.getElementById('showLogin');
        const showForgotPasswordLink = document.getElementById('showForgotPassword');
        const backToLoginLink = document.getElementById('backToLogin');

        // Form geçişleri
        showRegisterLink.addEventListener('click', function(e) {
            e.preventDefault();
            loginBox.classList.add('hidden');
            forgotPasswordBox.classList.add('hidden');
            registerBox.classList.remove('hidden');
        });

        showLoginLink.addEventListener('click', function(e) {
            e.preventDefault();
            registerBox.classList.add('hidden');
            forgotPasswordBox.classList.add('hidden');
            loginBox.classList.remove('hidden');
        });

        showForgotPasswordLink.addEventListener('click', function(e) {
            e.preventDefault();
            loginBox.classList.add('hidden');
            registerBox.classList.add('hidden');
            forgotPasswordBox.classList.remove('hidden');
        });

        backToLoginLink.addEventListener('click', function(e) {
            e.preventDefault();
            forgotPasswordBox.classList.add('hidden');
            loginBox.classList.remove('hidden');
        });

        // Kullanıcı kaydı
        registerForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const username = document.getElementById('registerUsername').value;
            const password = document.getElementById('registerPassword').value;
            const confirmPassword = document.getElementById('confirmPassword').value;

            if (password !== confirmPassword) {
                alert('Şifreler eşleşmiyor!');
                return;
            }

            // Yönetici kullanıcı adlarıyla çakışma kontrolü
            if (ADMIN_USERS.some(admin => admin.username === username)) {
                alert('Bu kullanıcı adı kullanılamaz!');
                return;
            }

            if (users.some(user => user.username === username)) {
                alert('Bu kullanıcı adı zaten kullanılıyor!');
                return;
            }

            users.push({ username, password });
            localStorage.setItem('users', JSON.stringify(users));
            alert('Kayıt başarılı! Giriş yapabilirsiniz.');
            
            registerBox.classList.add('hidden');
            loginBox.classList.remove('hidden');
            registerForm.reset();
        });

        // Giriş işlemi
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const username = document.getElementById('loginUsername').value;
            const password = document.getElementById('loginPassword').value;
            const loginType = document.querySelector('input[name="loginType"]:checked').value;

            if (loginType === 'admin') {
                const admin = ADMIN_USERS.find(a => a.username === username && a.password === password);
                if (admin) {
                    localStorage.setItem('currentUser', username);
                    localStorage.setItem('isAdmin', 'true');
                    window.location.href = 'admin.html';
                    return;
                } else {
                    alert('Yönetici kullanıcı adı veya şifre yanlış!');
                }
            } else {
                const user = users.find(u => u.username === username && u.password === password);
                if (user) {
                    localStorage.setItem('currentUser', username);
                    localStorage.setItem('isAdmin', 'false');
                    window.location.href = 'index.html';
                    return;
                } else {
                    alert('Kullanıcı adı veya şifre yanlış!');
                }
            }
        });

        // Şifremi unuttum işlemi
        forgotPasswordForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const username = document.getElementById('forgotUsername').value;
            const newPassword = document.getElementById('newForgotPassword').value;
            const confirmPassword = document.getElementById('confirmForgotPassword').value;

            if (newPassword !== confirmPassword) {
                alert('Şifreler eşleşmiyor!');
                return;
            }

            // Yönetici şifresi değiştirilemez
            if (ADMIN_USERS.some(admin => admin.username === username)) {
                alert('Yönetici şifresi bu yöntemle değiştirilemez!');
                return;
            }

            const userIndex = users.findIndex(u => u.username === username);
            if (userIndex === -1) {
                alert('Böyle bir kullanıcı bulunamadı!');
                return;
            }

            users[userIndex].password = newPassword;
            localStorage.setItem('users', JSON.stringify(users));
            alert('Şifreniz başarıyla güncellendi! Giriş yapabilirsiniz.');

            forgotPasswordBox.classList.add('hidden');
            loginBox.classList.remove('hidden');
            forgotPasswordForm.reset();
        });

    } else {
        // Ana sayfada veya yönetici sayfasındaysak
        const currentUser = localStorage.getItem('currentUser');
        const isAdmin = localStorage.getItem('isAdmin') === 'true';
        
        if (!currentUser) {
            window.location.href = 'login.html';
            return;
        }

        // Yönetici sayfasında normal kullanıcı kontrolü
        if (window.location.pathname.endsWith('admin.html') && !isAdmin) {
            window.location.href = 'index.html';
            return;
        }

        const userDisplay = document.getElementById('userDisplay');
        if (userDisplay) {
            userDisplay.textContent = `Hoş geldin, ${currentUser}${isAdmin ? ' (Yönetici)' : ''}`;
        }

        const logoutBtn = document.getElementById('logoutBtn');
        if (logoutBtn) {
            logoutBtn.addEventListener('click', function() {
                localStorage.removeItem('currentUser');
                localStorage.removeItem('isAdmin');
                window.location.href = 'login.html';
            });
        }

        // Hesabım sayfasındaysak
        if (window.location.pathname.endsWith('account.html')) {
            const updatePasswordForm = document.getElementById('updatePasswordForm');
            if (updatePasswordForm) {
                updatePasswordForm.addEventListener('submit', function(e) {
                    e.preventDefault();
                    const currentPassword = document.getElementById('currentPassword').value;
                    const newPassword = document.getElementById('newPassword').value;
                    const confirmNewPassword = document.getElementById('confirmNewPassword').value;

                    if (newPassword !== confirmNewPassword) {
                        alert('Yeni şifreler eşleşmiyor!');
                        return;
                    }

                    // Yönetici şifresi değiştirilemez
                    if (isAdmin) {
                        alert('Yönetici şifresi bu yöntemle değiştirilemez!');
                        return;
                    }

                    const userIndex = users.findIndex(u => u.username === currentUser);
                    if (users[userIndex].password !== currentPassword) {
                        alert('Mevcut şifre yanlış!');
                        return;
                    }

                    users[userIndex].password = newPassword;
                    localStorage.setItem('users', JSON.stringify(users));
                    alert('Şifreniz başarıyla güncellendi!');
                    updatePasswordForm.reset();
                });
            }
        }
    }
}); 