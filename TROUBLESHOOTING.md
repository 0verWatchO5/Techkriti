# BizPulse - Troubleshooting Guide

## 🔧 Common Issues & Solutions

### Issue 1: Data Not Saving
**Problem:** Changes disappear when I refresh the page

**Solutions:**
1. Check browser's localStorage is enabled
   - Settings → Privacy → Cookies and Site Data → Allow
2. Verify you're not in Private/Incognito mode
3. Check browser console for errors (F12)
4. Try a different browser
5. Clear browser cache and reload

### Issue 2: Charts Not Displaying
**Problem:** Chart sections show blank or gray area

**Solutions:**
1. Ensure Chart.js CDN is loading:
   - Open DevTools (F12) → Network tab
   - Reload page
   - Look for `chart.min.js` - should show status 200
2. If CDN fails, check internet connection
3. Try: Right-click page → Inspect → Console for errors
4. Refresh page with Ctrl+F5 (hard refresh)

### Issue 3: Inventory Not Deducting After Sale
**Problem:** Sale recorded but inventory quantity unchanged

**Solutions:**
1. Verify product has sufficient stock
2. Check if sale was marked as "completed"
3. Make sure product exists in inventory
4. Try editing the sale to update
5. Check localStorage for data integrity

### Issue 4: Low Stock Alert Not Showing
**Problem:** No warning for low inventory items

**Solutions:**
1. Verify minimum stock level is set correctly
2. Check if actual quantity is below minimum
3. Go to Inventory page to verify low stock items
4. Dashboard shows number of low stock items - check that

### Issue 5: Calculations Seem Wrong
**Problem:** Profit/margin/totals don't look correct

**Verification:**
1. Open Analytics page
2. Check Financial Summary section
3. Verify Revenue = Sum of all sales
4. Verify Expenses = Sum of all expenses
5. Profit should be Revenue - Expenses
6. Profit Margin = (Profit / Revenue) × 100

### Issue 6: Dark Mode Not Saving
**Problem:** Theme resets when I refresh

**Solutions:**
1. Check if localStorage is enabled
2. Clear browser cache and try again
3. Verify toggle button is working (click it again)
4. Try in a different browser
5. Check console for JavaScript errors

### Issue 7: Mobile Navigation Broken
**Problem:** Sidebar menu doesn't respond on mobile

**Solutions:**
1. Refresh page
2. Make sure viewport meta tag is recognized:
   - Address bar shows mobile layout
3. Tap hamburger button (☰) to toggle sidebar
4. Check browser zoom is at 100%
5. Try landscape orientation

### Issue 8: Page Layout Broken
**Problem:** Elements overlapping or misaligned

**Solutions:**
1. Clear browser cache (Ctrl+Shift+Delete)
2. Refresh with Ctrl+F5
3. Check zoom level (Ctrl+0 to reset)
4. Try different browser
5. Verify window is not too narrow

### Issue 9: Can't Add Data
**Problem:** "Save" button doesn't work or form won't submit

**Solutions:**
1. Check all required fields are filled (marked with *)
2. Verify numbers are valid (no letters in price/quantity)
3. Ensure date is selected
4. Check console for validation errors
5. Try refreshing page and adding again

### Issue 10: Filters Not Working
**Problem:** Search/filter doesn't narrow down results

**Solutions:**
1. Clear the filter completely and set again
2. Check for exact spelling
3. Verify category exists in dropdown
4. Try refreshing the page
5. Test each filter separately

## 🖥️ Browser Issues

### Chrome Issues
- Clear cache: Settings → Privacy → Clear browsing data
- Disable extensions temporarily
- Try in new Incognito window

### Firefox Issues
- Settings → Privacy → Cookies → Allow for this site
- Clear Site Data: Settings → Privacy → Cookies
- Disable add-ons temporarily

### Safari Issues
- Preferences → Privacy → Manage Website Data
- Clear History: History → Clear History
- Enable JavaScript: Preferences → Security

### Edge Issues
- Settings → Privacy → Clear browsing data
- Try InPrivate window
- Check extensions interfering

## 📊 Data Issues

### Lost All Data
**What happened?**
- Browser cache was cleared
- Private/Incognito mode was used
- Different browser is being used
- localStorage was manually cleared

**Recovery:**
- Data cannot be recovered if deleted
- Prevention: Use regular browsing mode
- Backup: Export important data regularly

### Duplicate Entries
**Problem:** Same entry appears multiple times

**Solutions:**
1. Delete duplicate manually
2. Refresh page to see actual state
3. Check if entries were added from different browser
4. Note: Each browser has separate data

### Missing Categories
**Problem:** Categories disappeared from dropdowns

**Solutions:**
1. Delete an item in that category first
2. Add new item with category name
3. Categories are generated from existing data
4. Refresh page to recalculate

### Inventory/Sales Mismatch
**Problem:** Sale says product sold but inventory not updated

**Solutions:**
1. Manually edit inventory
2. Delete sale and re-add it
3. Check the product was correctly selected
4. Verify sale status is "completed"

## 🎯 Performance Issues

### Page Loads Slowly
**Solutions:**
1. Check internet connection
2. Clear browser cache
3. Close other browser tabs
4. Restart browser
5. Check if Chart.js CDN is accessible

### Charts Load Slowly
**Solutions:**
1. Reduce amount of data
2. Check internet connection quality
3. Try in different browser
4. Disable browser extensions
5. Check if Chart.js loaded successfully

### Data Entry Slow
**Solutions:**
1. Close other applications
2. Restart browser
3. Clear cache
4. Check RAM usage
5. Try simpler form

## 🔒 Privacy & Security

### Is My Data Safe?
✅ Yes! All data stays in your browser only

### Can Someone Else See My Data?
❌ No, unless they use the same computer/browser

### How Do I Delete My Data?
1. Open DevTools (F12)
2. Go to Application tab
3. Find Local Storage
4. Find "bizpulse_*" entries
5. Delete them

### How Do I Backup Data?
1. Manual export via browser (future feature)
2. Screenshot important data
3. Use different devices for multiple backups

## 🌐 Network Issues

### CDN Not Loading (No Charts)
**Problem:** "Chart.js failed to load"

**Solutions:**
1. Check internet connection
2. Try again in few moments
3. Check if CDN is down: https://cdn.jsdelivr.net
4. Disable VPN if using one
5. Check firewall isn't blocking CDN

### Page Won't Load At All
**Solutions:**
1. Check file path is correct
2. Ensure all files are in correct folders
3. Check file permissions
4. Try opening index.html directly
5. Use "Open With" → Browser

## 📱 Mobile-Specific Issues

### Buttons Too Small
**Solution:**
- Page should auto-adjust
- If not, pinch-zoom out slightly
- Or rotate to landscape

### Tables Hard to Read
**Solution:**
- Swipe left/right to see more columns
- Or view from desktop for better experience

### Sidebar Won't Close
**Solution:**
- Tap the hamburger menu (☰) again
- Or tap outside the sidebar

### Forms Won't Submit
**Solution:**
- Scroll down to ensure Save button is visible
- Ensure all required fields (*) are filled
- Try scrolling form up to see all errors

## 🆘 Getting Help

### Check These First
1. ✅ Read this troubleshooting guide
2. ✅ Check FEATURES.md for capabilities
3. ✅ Check QUICKSTART.md for basic usage
4. ✅ Open DevTools to check for errors
5. ✅ Try a different browser

### Debug Steps
1. Open DevTools: F12
2. Go to Console tab
3. Look for red error messages
4. Try the action again
5. Note any error messages

### Error Messages Explained

| Error | Meaning | Solution |
|-------|---------|----------|
| "Chart.js not found" | CDN didn't load | Check internet |
| "localStorage not available" | Browser privacy settings | Enable localStorage |
| "Cannot read property" | Data structure issue | Refresh page |
| "Invalid input" | Form validation failed | Check all fields filled |
| "Product not found" | Product doesn't exist | Verify product added |

## 📋 Verification Checklist

Before reporting an issue, verify:
- [ ] Using a modern browser (Chrome, Firefox, Safari, Edge)
- [ ] JavaScript is enabled
- [ ] localStorage is enabled
- [ ] Not in Private/Incognito mode
- [ ] All files are in correct locations
- [ ] Chart.js CDN is loading
- [ ] Browser zoom is at 100%
- [ ] Cache has been cleared
- [ ] Tried refreshing the page
- [ ] Tried a different browser

## 🔄 Reset Everything

**To start fresh:**
1. Open DevTools (F12)
2. Go to Application → Local Storage
3. Find all "bizpulse_" entries
4. Delete them
5. Refresh page
6. Default sample data will reload

## 📞 Support Resources

**Browser Support:**
- Chrome: google.com/chrome
- Firefox: mozilla.org/firefox
- Safari: apple.com/safari
- Edge: microsoft.com/edge

**Development Tools:**
- DevTools: F12 in any browser
- Code Editor: VS Code, Sublime, etc.
- Chart.js: chart.js
- localStorage: mdn.io

## ✨ Tips for Best Experience

1. **Use latest browser version**
2. **Enable JavaScript**
3. **Use regular browsing (not Incognito)**
4. **Keep data backed up**
5. **Clear cache monthly**
6. **Use dark mode for comfort**
7. **Bookmark the dashboard**
8. **Check analytics weekly**

---

**Still having issues?** 
- Check browser console for error messages
- Verify all files are present
- Try clearing cache and cookies
- Restart your browser
- Contact support with error details

**BizPulse Support**: Ready to help! 🚀
