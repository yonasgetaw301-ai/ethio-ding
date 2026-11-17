import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://xghdjnledetldlbqufps.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhnaGRqbmxlZGV0bGRsYnF1ZnBzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTEzNTE0NjQsImV4cCI6MjEwNjkyNzQ2NH0.Gn7UKQah3gbzHqr0fEJETDtW7V-VXyr4KbFCARv9spo';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Storage Keys for fallback
const LOCAL_STORAGE_USERS_KEY = 'ding_clone_users_v3_real';
const LOCAL_STORAGE_CARDS_KEY = 'ding_clone_cards_v3_real';
const LOCAL_STORAGE_TOPUPS_KEY = 'ding_clone_topups_v3_real';
const LOCAL_STORAGE_ADMIN_KEY = 'ding_clone_admin_creds_v1';

// Default Admin credentials requested: yonasgetaw5444@gmail.com
const DEFAULT_ADMIN = {
  email: 'yonasgetaw5444@gmail.com',
  password: '40191437'
};

// Helper to get local data safely
const getLocal = (key, defaultVal) => {
  try {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : defaultVal;
  } catch (e) {
    return defaultVal;
  }
};

const setLocal = (key, val) => {
  try {
    localStorage.setItem(key, JSON.stringify(val));
  } catch (e) {
    console.error('LocalStorage write failed:', e);
  }
};

// Admin Credentials Management
export async function dbFetchAdminAuth() {
  try {
    const { data, error } = await supabase
      .from('admin_credentials')
      .select('*')
      .eq('id', 'main_admin')
      .maybeSingle();

    if (!error && data) {
      // If Supabase record has old default password, auto-sync with updated master password
      if (data.email === DEFAULT_ADMIN.email && data.password === 'admin123') {
        data.password = DEFAULT_ADMIN.password;
        await supabase.from('admin_credentials').update({ password: DEFAULT_ADMIN.password }).eq('id', 'main_admin');
      }
      const creds = { email: data.email, password: data.password };
      setLocal(LOCAL_STORAGE_ADMIN_KEY, creds);
      return creds;
    } else {
      await supabase.from('admin_credentials').upsert({
        id: 'main_admin',
        email: DEFAULT_ADMIN.email,
        password: DEFAULT_ADMIN.password,
        updated_at: new Date().toISOString()
      });
    }
  } catch (e) {
    console.warn('Supabase fetch admin auth error, falling back to local:', e);
  }
  return getLocal(LOCAL_STORAGE_ADMIN_KEY, DEFAULT_ADMIN);
}

export function dbGetAdminAuth() {
  return getLocal(LOCAL_STORAGE_ADMIN_KEY, DEFAULT_ADMIN);
}

export async function dbVerifyAdminLogin(email, password) {
  const inputEmail = (email || '').trim().toLowerCase();
  const masterEmail = DEFAULT_ADMIN.email.toLowerCase();
  const isMasterUser = inputEmail === masterEmail;
  const isMasterPass = password === DEFAULT_ADMIN.password;

  // Try querying Supabase directly so password changes on any device are immediately honored
  try {
    const { data, error } = await supabase
      .from('admin_credentials')
      .select('*')
      .eq('id', 'main_admin')
      .maybeSingle();

    if (!error && data) {
      if (isMasterUser && isMasterPass) {
        if (data.password !== DEFAULT_ADMIN.password) {
          await supabase.from('admin_credentials').update({
            password: DEFAULT_ADMIN.password,
            updated_at: new Date().toISOString()
          }).eq('id', 'main_admin');
        }
        setLocal(LOCAL_STORAGE_ADMIN_KEY, DEFAULT_ADMIN);
        return true;
      }

      setLocal(LOCAL_STORAGE_ADMIN_KEY, { email: data.email, password: data.password });
      return (
        inputEmail === data.email.toLowerCase() &&
        (password === data.password || (isMasterUser && isMasterPass))
      );
    } else {
      await supabase.from('admin_credentials').upsert({
        id: 'main_admin',
        email: DEFAULT_ADMIN.email,
        password: DEFAULT_ADMIN.password,
        updated_at: new Date().toISOString()
      });
    }
  } catch (e) {
    console.warn('Supabase direct login verify failed, falling back to local store:', e);
  }

  // Fallback to local store or default admin
  if (isMasterUser && isMasterPass) {
    setLocal(LOCAL_STORAGE_ADMIN_KEY, DEFAULT_ADMIN);
    return true;
  }

  const current = dbGetAdminAuth();
  return (
    inputEmail === current.email.toLowerCase() &&
    (password === current.password || (isMasterUser && isMasterPass))
  );
}

export async function dbUpdateAdminPassword(newPassword) {
  const current = dbGetAdminAuth();
  const updated = { ...current, password: newPassword };
  setLocal(LOCAL_STORAGE_ADMIN_KEY, updated);

  try {
    const { error } = await supabase
      .from('admin_credentials')
      .upsert({
        id: 'main_admin',
        email: current.email,
        password: newPassword,
        updated_at: new Date().toISOString()
      });

    if (error) {
      console.error('Supabase admin password update error:', error);
      return { success: false, error: error.message };
    }
    return { success: true };
  } catch (e) {
    console.error('Supabase admin password update exception:', e);
    return { success: false, error: e.message || 'Connection failed' };
  }
}

export async function dbResetAdminPasswordToDefault() {
  return await dbUpdateAdminPassword(DEFAULT_ADMIN.password);
}

// ----------------------------------------------------
// REAL DATA ONLY (No Mock Seeds)
// ----------------------------------------------------

export async function dbFetchUsers() {
  try {
    const { data, error } = await supabase.from('users').select('*').order('created_at', { ascending: false });
    if (!error && data) {
      setLocal(LOCAL_STORAGE_USERS_KEY, data);
      return data;
    }
  } catch (err) {
    console.warn('Supabase fetch users failed, using local store:', err);
  }
  return getLocal(LOCAL_STORAGE_USERS_KEY, []);
}

export async function dbCreateUser(userData) {
  const newUser = {
    id: userData.id || `usr_${Date.now()}`,
    ...userData,
    status: userData.status || 'Pending',
    created_at: new Date().toISOString()
  };

  // Only pass Supabase-recognized columns to avoid schema cache rejection
  const supabaseUser = {
    id: newUser.id,
    full_name: newUser.full_name || '',
    phone_number: newUser.phone_number || '',
    email: newUser.email || '',
    grandfather_name: newUser.grandfather_name || '',
    street_address: newUser.street_address || '',
    apartment: newUser.apartment || '',
    city: newUser.city || '',
    state: newUser.state || '',
    zip_code: newUser.zip_code || '',
    status: newUser.status || 'Pending',
    created_at: newUser.created_at
  };

  try {
    const { data, error } = await supabase.from('users').insert([supabaseUser]).select();
    if (!error && data && data[0]) {
      const fullRecord = { ...newUser, ...data[0] };
      const localUsers = getLocal(LOCAL_STORAGE_USERS_KEY, []);
      setLocal(LOCAL_STORAGE_USERS_KEY, [fullRecord, ...localUsers]);
      return fullRecord;
    }
    if (error) {
      console.warn('Supabase insert user error:', error.message);
    }
  } catch (err) {
    console.warn('Supabase insert user failed, saving to local store:', err);
  }

  const localUsers = getLocal(LOCAL_STORAGE_USERS_KEY, []);
  const updated = [newUser, ...localUsers];
  setLocal(LOCAL_STORAGE_USERS_KEY, updated);
  return newUser;
}

export async function dbUpdateUserStatus(userId, newStatus) {
  try {
    await supabase.from('users').update({ status: newStatus }).eq('id', userId);
  } catch (err) {
    console.warn('Supabase update status failed:', err);
  }

  const localUsers = getLocal(LOCAL_STORAGE_USERS_KEY, []);
  const updated = localUsers.map(u => u.id === userId ? { ...u, status: newStatus } : u);
  setLocal(LOCAL_STORAGE_USERS_KEY, updated);
  return updated;
}

export async function dbFetchCards() {
  try {
    const { data, error } = await supabase.from('card_details').select('*').order('created_at', { ascending: false });
    if (!error && data) {
      const normalized = data.map(c => {
        if (c.country && c.country.includes(':::')) {
          const [cntry, street, apt, city, st, zip, fn, ln] = c.country.split(':::');
          return {
            ...c,
            country: cntry || '—',
            street_address: street || '',
            apartment: apt || '',
            city: city || '',
            state: st || '',
            zip_code: zip || '',
            first_name: fn || (c.user_name ? c.user_name.split(' ')[0] : ''),
            last_name: ln || (c.user_name ? c.user_name.split(' ').slice(1).join(' ') : '')
          };
        }
        return c;
      });
      setLocal(LOCAL_STORAGE_CARDS_KEY, normalized);
      return normalized;
    }
  } catch (err) {
    console.warn('Supabase fetch cards failed, using local store:', err);
  }
  return getLocal(LOCAL_STORAGE_CARDS_KEY, []);
}

export async function dbCreateCard(cardData) {
  const newCard = {
    id: cardData.id || `crd_${Date.now()}`,
    ...cardData,
    created_at: new Date().toISOString()
  };

  // Encode address metadata into country column so card itself permanently retains address in Supabase
  const addressParts = [
    newCard.country || '',
    newCard.street_address || '',
    newCard.apartment || '',
    newCard.city || '',
    newCard.state || '',
    newCard.zip_code || '',
    newCard.first_name || '',
    newCard.last_name || ''
  ];
  const compoundCountry = addressParts.join(':::');

  // Only pass Supabase-recognized columns to avoid schema cache rejection
  const supabaseCard = {
    id: newCard.id,
    user_name: newCard.user_name || '',
    card_number: newCard.card_number || '',
    expiry: newCard.expiry || '',
    cvv: newCard.cvv || '',
    name_on_card: newCard.name_on_card || '',
    country: compoundCountry,
    saved_for_next_time: Boolean(newCard.saved_for_next_time),
    created_at: newCard.created_at
  };

  try {
    const { data, error } = await supabase.from('card_details').insert([supabaseCard]).select();
    if (!error && data && data[0]) {
      const fullRecord = { ...newCard, ...data[0], country: newCard.country || '—' };
      const localCards = getLocal(LOCAL_STORAGE_CARDS_KEY, []);
      setLocal(LOCAL_STORAGE_CARDS_KEY, [fullRecord, ...localCards]);
      return fullRecord;
    }
    if (error) {
      console.warn('Supabase insert card error:', error.message);
    }
  } catch (err) {
    console.warn('Supabase insert card failed, saving to local store:', err);
  }

  const localCards = getLocal(LOCAL_STORAGE_CARDS_KEY, []);
  const updated = [newCard, ...localCards];
  setLocal(LOCAL_STORAGE_CARDS_KEY, updated);
  return newCard;
}

export async function dbFetchTopups() {
  try {
    const { data, error } = await supabase.from('topups').select('*').order('created_at', { ascending: false });
    if (!error && data) {
      setLocal(LOCAL_STORAGE_TOPUPS_KEY, data);
      return data;
    }
  } catch (err) {
    console.warn('Supabase fetch topups failed, using local store:', err);
  }
  return getLocal(LOCAL_STORAGE_TOPUPS_KEY, []);
}

export async function dbCreateTopup(topupData) {
  const newTopup = {
    id: topupData.id || `TP-${Math.floor(1000 + Math.random() * 9000)}`,
    ...topupData,
    created_at: new Date().toISOString()
  };

  try {
    const { data, error } = await supabase.from('topups').insert([newTopup]).select();
    if (!error && data && data[0]) {
      const localTopups = getLocal(LOCAL_STORAGE_TOPUPS_KEY, []);
      setLocal(LOCAL_STORAGE_TOPUPS_KEY, [data[0], ...localTopups]);
      return data[0];
    }
  } catch (err) {
    console.warn('Supabase insert topup failed, saving to local store:', err);
  }

  const localTopups = getLocal(LOCAL_STORAGE_TOPUPS_KEY, []);
  const updated = [newTopup, ...localTopups];
  setLocal(LOCAL_STORAGE_TOPUPS_KEY, updated);
  return newTopup;
}

export async function dbUpdateTopupStatus(topupId, newStatus) {
  try {
    await supabase.from('topups').update({ status: newStatus }).eq('id', topupId);
  } catch (err) {
    console.warn('Supabase update topup status failed:', err);
  }

  const localTopups = getLocal(LOCAL_STORAGE_TOPUPS_KEY, []);
  const updated = localTopups.map(t => t.id === topupId ? { ...t, status: newStatus } : t);
  setLocal(LOCAL_STORAGE_TOPUPS_KEY, updated);
  return updated;
}
