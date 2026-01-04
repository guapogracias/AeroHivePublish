"use client";

import { motion } from 'motion/react';

interface ProfoundIsotypeASCIIProps {
  animated?: boolean;
  /** Optional override for sizing/positioning */
  className?: string;
}

export const PROFOUND_ISOTYPE_ASCII_CONTENT = `
                                                                                                    
                                                                                                    
                                                                                                    
                                                                                                    
                                                                                                    
                                                                                                    
                                                                                                    
                                                                                                    
                                                                                                    
                                                                                                    
                                                                                                    
                                                                                                    
                                                                                                    
                               ===                                ++++                              
                            ******                                #######                           
                         #******                                    ######*                         
                      ###*****              ::::::::::::               ####***                      
                     ##**##                .:-:::::::::::                %#####                     
                  -+#%%%%                 ..::::::::::::::                  ##%%+-                  
               ***#%*%#=                  ..::::::::::::::                  +*##%#**                
            *#######*+*=-                 ..:::::--:::::::                 -=++*#%%####             
          ########*+++=---:::::::      :::..::::::::::::::=-       ::::::::--=+++#%%%%###           
        #########+=--====----:::::::::-:::..::::::::::::::==-=-:::::::--=======--=#%%%%%###         
      #########         -------------=+:::..::::::::::::::===*=-==========+=        ##%%%%##        
     ++**###                 ------==++--:..::::::::::::::=++#*+++++=+=               #%%%%##*      
   +++++                              =+=:.:::::::::::::::=##*                            +=+++++   
    ##****#                            ::..::::::::::::::::-=                            *******    
      ##*****#                        .....:::::::::::::::::::                         ##*****      
        ###****#                   ::=....::::::::::::::::::::*-:                   ####**##        
          #####**          ::::::::::=::.::::::::::::::::::::-+::::::::::          ###*###          
            %##%%%*---::::::::::---==+:::::::::::::::::::::::-*==--::::::::::-::-*#%%##%            
              +%#%%#*+=---===========+:::::::::::::::::::::::-*+======------=+**#%##%*              
            :+++**######**++++        --:::::::::::::::::::-==        ===+*#######*++*+             
            -===++*#########          ----:::::::::::::::-====         ##########*++++==            
            -------=#########           ---=-:::::::::-=+==          ##########+=-----==            
            -------  ##########           --+**#######***=         ##########    -----=             
             ---        ####**++             %%%##%%%%%%%          ==+*##           --=             
             ---            ===              ###*#%%%##%%                           --=             
             ---                                %%@@%                               --=             
             ---                                                                    --              
                                                                                                    
                                                                                                    
                                                                                                    
                                                                                                    
                                                                                                    
                                                                                                    
                                                                                                    
                                                                                                    
                                                                                                    
                                                                                                    
                                                                                                    
                                                                                                    
                                                                                                    
`;

export default function ProfoundIsotypeASCII({
  animated = true,
  className,
}: ProfoundIsotypeASCIIProps) {
  const baseClassName =
    "text-[6.4px] leading-[4.8px] md:text-[12.8px] md:leading-[8px] text-[var(--text-primary)] font-mono whitespace-pre text-center select-none overflow-hidden";
  const finalClassName = className ?? baseClassName;
  
  if (animated) {
    return (
      <motion.pre
        className={finalClassName}
        initial={{
          opacity: 0,
          y: -50,
        }}
        animate={{
          opacity: 1,
          y: 0,
        }}
        transition={{
          duration: 0.7,
          ease: [0.25, 0.1, 0.25, 1],
        }}
      >
        {PROFOUND_ISOTYPE_ASCII_CONTENT}
      </motion.pre>
    );
  }

  return (
    <pre className={finalClassName}>
      {PROFOUND_ISOTYPE_ASCII_CONTENT}
    </pre>
  );
}
