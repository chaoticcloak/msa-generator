

from flask import Flask, render_template, request, send_file, flash, redirect, url_for
import os
from datetime import datetime
from docx_builder import MSADocumentBuilder

app = Flask(__name__)
app.secret_key = 'msa_generator_secret_key_2025'

# Ensure output directory exists
os.makedirs('output', exist_ok=True)

@app.route('/')
def form():
    """Render the main form for MSA generation"""
    return render_template('form.html')

@app.route('/generate', methods=['POST'])
def generate_msa():
    """Process form data and generate MSA document"""
    try:
        # Extract and validate form data
        client_data = {
            'name': request.form.get('client_name', '').strip(),
            'email': request.form.get('client_email', '').strip(),
            'address': request.form.get('client_address', '').strip(),
            'phone': request.form.get('client_phone', '').strip()
        }
        
        # Extract preparer information (with defaults)
        preparer_data = {
            'name': request.form.get('preparer_name', '').strip() or 'Kevin Fuller',
            'email': request.form.get('preparer_email', '').strip() or 'k.fuller@avatarmsp.com'
        }
        
        # Validate required fields
        if not all(client_data.values()):
            flash('All client information fields are required.', 'error')
            return redirect(url_for('form'))
        
        # Service selections
        include_compliance = 'compliance_services' in request.form
        include_security_plus = 'security_plus_services' in request.form
        
        # Pricing model validation
        pricing_model = request.form.get('pricing_model')
        if not pricing_model or pricing_model not in ['workstation', 'user']:
            flash('Please select a pricing model.', 'error')
            return redirect(url_for('form'))
        
        # Pricing information
        pricing_data = {}
        if pricing_model == 'workstation':
            workstation_count = request.form.get('workstation_count', '0')
            workstation_price = request.form.get('workstation_price', '110.00')
            try:
                pricing_data['workstation_count'] = int(workstation_count)
                pricing_data['workstation_price'] = float(workstation_price)
            except ValueError:
                flash('Invalid workstation pricing data.', 'error')
                return redirect(url_for('form'))
        else:  # user model
            user_count = request.form.get('user_count', '0')
            user_price = request.form.get('user_price', '15.00')
            try:
                pricing_data['user_count'] = int(user_count)
                pricing_data['user_price'] = float(user_price)
            except ValueError:
                flash('Invalid user pricing data.', 'error')
                return redirect(url_for('form'))
        
        # Generate document
        builder = MSADocumentBuilder()
        output_path = builder.generate_msa(
            client_data=client_data,
            preparer_data=preparer_data,
            include_compliance=include_compliance,
            include_security_plus=include_security_plus,
            pricing_model=pricing_model,
            pricing_data=pricing_data
        )
        
        return send_file(
            output_path, 
            as_attachment=True, 
            download_name=f"MSA_{client_data['name'].replace(' ', '_')}_{datetime.now().strftime('%Y%m%d')}.docx"
        )
        
    except Exception as e:
        flash(f'An error occurred while generating the document: {str(e)}', 'error')
        return redirect(url_for('form'))

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)
