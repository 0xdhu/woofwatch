import React, { useEffect, useState } from 'react';
  import { createElement, loadAirwallex, confirmPaymentIntent, getElement } from 'airwallex-payment-elements';
  const PaymentAirwallex: React.FC = () => {
    const [elementShow, setElementShow] = useState(false); // Example: show element state
    const [isSubmitting, setIsSubmitting] = useState(false); // Example: show submission processing state
    const [errorMessage, setErrorMessage] = useState(''); // Example: set error state
    const [inputErrorMessage, setInputErrorMessage] = useState(false); //  Example: set input error state


    useEffect(() => {
        // STEP #2: Initialize Airwallex with the appropriate Airwallex environment and other configurations
        loadAirwallex({
          env: 'prod', // Can choose other production environments, 'staging | 'demo' | 'prod'
          origin: window.location.origin, // Setup your event target to receive the browser events message
          fonts: [
            // Can customize the font for the payment elements
            {
              src: 'https://checkout.airwallex.com/fonts/CircularXXWeb/CircularXXWeb-Regular.woff2',
              family: 'AxLLCircular',
              weight: 400,
            },
          ],
          // For more detailed documentation at https://github.com/airwallex/airwallex-payment-demo/tree/master/docs
        }).then(() => {
          // STEP #4: Create the card element
          const card = createElement('card');
          // STEP #5: Mount the card element to the empty container created previously
          card?.mount('card'); // This 'card' id MUST MATCH the id on your empty container created in Step 3
        });
    
        // STEP #7: Add an event listener to ensure the element is mounted
        const onReady = (event: any) => {
          /**
           * ...Handle events on element ready
           */
          setElementShow(true); // Example: sets show once mounted
          getElement('card')?.focus(); // Example: focuses on input field
          console.log(`The Card element is ready, ${JSON.stringify(event.detail)}`);
        };
    
        // STEP #8: Add an event listener to respond to errors
        const onError = (event: any) => {
          /**
           * ... Handle events on error
           */
          const { error } = event.detail;
          setIsSubmitting(false);
          setErrorMessage(error.message);
          console.error('There was an error', error);
        };
    
        // STEP #9: Add an event listener to get input focus status
        const onFocus = (_event:any) => {
          setInputErrorMessage(false); // Example: clear input error message
        };
    
        // STEP #10: Add an event listener to show input error message when finish typing
        const onBlur = (event:any) => {
          const { error } = event.detail;
          setInputErrorMessage(error?.message ?? JSON.stringify(error)); // Example: set input error message
        };
    
        const domElement = document.getElementById('card');
        if(domElement){
            domElement.addEventListener('onReady', onReady);
            domElement.addEventListener('onError', onError);
            domElement.addEventListener('onBlur', onBlur);
            domElement.addEventListener('onFocus', onFocus);
            return () => {
              domElement.removeEventListener('onReady', onReady);
              domElement.removeEventListener('onError', onError);
              domElement.removeEventListener('onFocus', onFocus);
              domElement.removeEventListener('onBlur', onBlur);
            };
        }

      }, []); // This effect should ONLY RUN ONCE as we do not want to reload Airwallex and remount the elements
    
      const inputStyle = {
        // Custom styling for the inputs, can be placed in css
        border: '1px solid',
        borderRadius: '5px',
        alignSelf: 'flex-start',
        marginTop: '8px',
        height: '28px',
      };

    return (
      <div>
        <div className="flex flex-col relative w-full pb-6">
            {/* Example below: show loading state */}
            {!elementShow && <p>Loading...</p>}
            {/* Example below: display response message block */}
            {errorMessage.length > 0 && <p id="error">{errorMessage}</p>}
            <div
                id="card"
                style={inputStyle} // Example: input styling can be moved to css
            />
        </div>
      </div>
    )
  }
  
  export default PaymentAirwallex
  