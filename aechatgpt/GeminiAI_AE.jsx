/**
 * Gemini AI Assistant for After Effects
 * A beautiful and functional AI-powered script panel for After Effects
 * Integrates with Google Gemini API for scripting assistance
 */

(function(thisObj) {
    
    // Configuration
    var GEMINI_API_KEY = "AIzaSyBOKFibn4Rbh54Fxzo8LKZ09pVboZsCHwU"; // Your API key
    var GEMINI_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=" + GEMINI_API_KEY;
    
    // Create main panel
    function createPanel(thisObj) {
        var panel = (thisObj instanceof Panel) ? thisObj : new Window("dialog", "Gemini AI Assistant", undefined, {resizeable: true});
        
        // Set panel properties
        panel.orientation = "column";
        panel.alignChildren = ["fill", "top"];
        panel.spacing = 10;
        panel.margins = 16;
        panel.preferredSize.width = 400;
        panel.preferredSize.height = 600;
        
        // Header section
        var headerGroup = panel.add("group");
        headerGroup.orientation = "row";
        headerGroup.alignChildren = ["fill", "center"];
        
        var titleText = headerGroup.add("statictext", undefined, "🤖 Gemini AI Assistant");
        titleText.graphics.font = ScriptUI.newFont("Arial", "BOLD", 18);
        
        var statusIndicator = headerGroup.add("panel");
        statusIndicator.preferredSize = [12, 12];
        statusIndicator.graphics.backgroundColor = statusIndicator.graphics.newBrush(statusIndicator.graphics.BrushType.SOLID_COLOR, [0.2, 0.8, 0.2, 1]);
        
        // Quick action buttons
        var quickActionsGroup = panel.add("group");
        quickActionsGroup.orientation = "row";
        quickActionsGroup.alignment = "fill";
        quickActionsGroup.spacing = 5;
        
        var quickBtns = [
            {text: "📝 Expression", action: "expression"},
            {text: "🔧 Script", action: "script"},
            {text: "💡 Help", action: "help"}
        ];
        
        var quickButtons = [];
        for (var i = 0; i < quickBtns.length; i++) {
            var btn = quickActionsGroup.add("button", undefined, quickBtns[i].text);
            btn.preferredSize.height = 35;
            btn.fillBrush = btn.graphics.newBrush(btn.graphics.BrushType.SOLID_COLOR, [0.3, 0.4, 0.8, 1]);
            btn.userData = quickBtns[i].action;
            quickButtons.push(btn);
        }
        
        // Input section
        var inputGroup = panel.add("group");
        inputGroup.orientation = "column";
        inputGroup.alignChildren = ["fill", "top"];
        inputGroup.alignment = "fill";
        
        var inputLabel = inputGroup.add("statictext", undefined, "What would you like me to help you with?");
        inputLabel.graphics.font = ScriptUI.newFont("Arial", "BOLD", 12);
        
        var inputText = inputGroup.add("edittext", undefined, "", {multiline: true, scrolling: true});
        inputText.preferredSize.height = 100;
        inputText.alignment = "fill";
        
        // Context selection
        var contextGroup = panel.add("group");
        contextGroup.orientation = "row";
        contextGroup.alignChildren = ["left", "center"];
        
        var contextLabel = contextGroup.add("statictext", undefined, "Context:");
        var contextDropdown = contextGroup.add("dropdownlist", undefined, [
            "General After Effects",
            "Expressions",
            "Scripting",
            "Animation",
            "Effects & Presets",
            "Rendering",
            "Troubleshooting"
        ]);
        contextDropdown.selection = 0;
        
        // Send button
        var sendGroup = panel.add("group");
        sendGroup.orientation = "row";
        sendGroup.alignment = "fill";
        sendGroup.spacing = 10;
        
        var sendButton = sendGroup.add("button", undefined, "✨ Ask Gemini");
        sendButton.preferredSize.height = 40;
        sendButton.fillBrush = sendButton.graphics.newBrush(sendButton.graphics.BrushType.SOLID_COLOR, [0.2, 0.7, 0.3, 1]);
        
        var clearButton = sendGroup.add("button", undefined, "🗑️ Clear");
        clearButton.preferredSize.height = 40;
        
        // Response section
        var responseGroup = panel.add("group");
        responseGroup.orientation = "column";
        responseGroup.alignChildren = ["fill", "top"];
        responseGroup.alignment = "fill";
        
        var responseLabel = responseGroup.add("statictext", undefined, "Gemini Response:");
        responseLabel.graphics.font = ScriptUI.newFont("Arial", "BOLD", 12);
        
        var responseText = responseGroup.add("edittext", undefined, "", {multiline: true, scrolling: true, readonly: true});
        responseText.preferredSize.height = 200;
        responseText.alignment = "fill";
        
        // Action buttons for response
        var actionGroup = panel.add("group");
        actionGroup.orientation = "row";
        actionGroup.alignment = "fill";
        actionGroup.spacing = 5;
        
        var copyButton = actionGroup.add("button", undefined, "📋 Copy");
        var executeButton = actionGroup.add("button", undefined, "▶️ Execute");
        var saveButton = actionGroup.add("button", undefined, "💾 Save");
        
        // Progress bar (initially hidden)
        var progressGroup = panel.add("group");
        progressGroup.visible = false;
        progressGroup.orientation = "column";
        progressGroup.alignChildren = ["fill", "center"];
        
        var progressBar = progressGroup.add("progressbar", undefined, 0, 100);
        progressBar.preferredSize.height = 6;
        progressBar.alignment = "fill";
        
        var progressLabel = progressGroup.add("statictext", undefined, "Thinking...");
        progressLabel.justify = "center";
        
        // Event handlers
        sendButton.onClick = function() {
            var prompt = inputText.text;
            var context = contextDropdown.selection.text;
            
            if (prompt.trim() === "") {
                alert("Please enter a question or request.");
                return;
            }
            
            askGemini(prompt, context, responseText, progressGroup, progressBar, progressLabel, statusIndicator);
        };
        
        clearButton.onClick = function() {
            inputText.text = "";
            responseText.text = "";
        };
        
        copyButton.onClick = function() {
            if (responseText.text !== "") {
                // Copy to clipboard (After Effects doesn't have direct clipboard access)
                // We'll show the text in a dialog for easy copying
                var copyDialog = new Window("dialog", "Copy Response");
                copyDialog.add("statictext", undefined, "Select all and copy (Ctrl+C / Cmd+C):");
                var copyField = copyDialog.add("edittext", undefined, responseText.text, {multiline: true, scrolling: true});
                copyField.preferredSize = [400, 200];
                copyField.active = true;
                copyField.textselection = [0, copyField.text.length];
                
                var okBtn = copyDialog.add("button", undefined, "OK");
                okBtn.onClick = function() { copyDialog.close(); };
                
                copyDialog.show();
            }
        };
        
        executeButton.onClick = function() {
            if (responseText.text !== "") {
                try {
                    // Try to execute the response as After Effects script
                    eval(responseText.text);
                    alert("Code executed successfully!");
                } catch (e) {
                    alert("Error executing code: " + e.toString());
                }
            }
        };
        
        saveButton.onClick = function() {
            if (responseText.text !== "") {
                var file = File.saveDialog("Save Gemini Response", "*.txt");
                if (file) {
                    file.open("w");
                    file.write(responseText.text);
                    file.close();
                    alert("Response saved successfully!");
                }
            }
        };
        
        // Quick action buttons
        for (var j = 0; j < quickButtons.length; j++) {
            quickButtons[j].onClick = (function(action) {
                return function() {
                    var templates = {
                        expression: "Create an After Effects expression that ",
                        script: "Write an After Effects script that ",
                        help: "Help me understand how to "
                    };
                    inputText.text = templates[action] || "";
                    inputText.active = true;
                };
            })(quickButtons[j].userData);
        }
        
        return panel;
    }
    
    // Function to make API call to Gemini
    function askGemini(prompt, context, responseField, progressGroup, progressBar, progressLabel, statusIndicator) {
        progressGroup.visible = true;
        progressBar.value = 0;
        progressLabel.text = "Connecting to Gemini...";
        
        // Update status indicator to yellow (processing)
        statusIndicator.graphics.backgroundColor = statusIndicator.graphics.newBrush(statusIndicator.graphics.BrushType.SOLID_COLOR, [0.8, 0.8, 0.2, 1]);
        
        // Prepare the enhanced prompt with After Effects context
        var enhancedPrompt = "You are an expert After Effects assistant. Context: " + context + ".\n\n" +
                           "Please provide helpful, accurate information for After Effects users. " +
                           "If providing code, make it ready to use in After Effects.\n\n" +
                           "User question: " + prompt;
        
        // Prepare request data
        var requestData = {
            contents: [{
                parts: [{
                    text: enhancedPrompt
                }]
            }],
            generationConfig: {
                temperature: 0.7,
                topK: 40,
                topP: 0.95,
                maxOutputTokens: 2048
            },
            safetySettings: [
                {
                    category: "HARM_CATEGORY_HARASSMENT",
                    threshold: "BLOCK_MEDIUM_AND_ABOVE"
                },
                {
                    category: "HARM_CATEGORY_HATE_SPEECH", 
                    threshold: "BLOCK_MEDIUM_AND_ABOVE"
                },
                {
                    category: "HARM_CATEGORY_SEXUALLY_EXPLICIT",
                    threshold: "BLOCK_MEDIUM_AND_ABOVE"
                },
                {
                    category: "HARM_CATEGORY_DANGEROUS_CONTENT",
                    threshold: "BLOCK_MEDIUM_AND_ABOVE"
                }
            ]
        };
        
        progressBar.value = 25;
        progressLabel.text = "Sending request...";
        
        // Make HTTP request
        try {
            var response = makeHttpRequest(GEMINI_URL, JSON.stringify(requestData));
            
            progressBar.value = 75;
            progressLabel.text = "Processing response...";
            
            if (response) {
                var jsonResponse = JSON.parse(response);
                
                if (jsonResponse.candidates && jsonResponse.candidates.length > 0) {
                    var aiResponse = jsonResponse.candidates[0].content.parts[0].text;
                    responseField.text = aiResponse;
                    
                    // Update status indicator to green (success)
                    statusIndicator.graphics.backgroundColor = statusIndicator.graphics.newBrush(statusIndicator.graphics.BrushType.SOLID_COLOR, [0.2, 0.8, 0.2, 1]);
                } else {
                    responseField.text = "Error: No response from Gemini API";
                    // Update status indicator to red (error)
                    statusIndicator.graphics.backgroundColor = statusIndicator.graphics.newBrush(statusIndicator.graphics.BrushType.SOLID_COLOR, [0.8, 0.2, 0.2, 1]);
                }
            } else {
                responseField.text = "Error: Failed to connect to Gemini API";
                statusIndicator.graphics.backgroundColor = statusIndicator.graphics.newBrush(statusIndicator.graphics.BrushType.SOLID_COLOR, [0.8, 0.2, 0.2, 1]);
            }
            
            progressBar.value = 100;
            progressLabel.text = "Complete!";
            
        } catch (e) {
            responseField.text = "Error: " + e.toString();
            statusIndicator.graphics.backgroundColor = statusIndicator.graphics.newBrush(statusIndicator.graphics.BrushType.SOLID_COLOR, [0.8, 0.2, 0.2, 1]);
            progressBar.value = 100;
            progressLabel.text = "Error occurred";
        }
        
        // Hide progress after 2 seconds
        app.setTimeout(function() {
            progressGroup.visible = false;
        }, 2000);
    }
    
    // Function to make HTTP requests (simplified for After Effects)
    function makeHttpRequest(url, data) {
        try {
            // Note: After Effects has limited HTTP capabilities
            // This is a simplified version - in practice you might need a helper application
            // or use a different approach for HTTP requests
            
            var command = '';
            
            // For Windows
            if ($.os.indexOf("Windows") !== -1) {
                // Using PowerShell for HTTP request
                command = 'powershell -Command "' +
                    '$headers = @{\"Content-Type\"=\"application/json\"}; ' +
                    '$body = \'' + data.replace(/'/g, "''") + '\'; ' +
                    'try { ' +
                        '$response = Invoke-RestMethod -Uri \"' + url + '\" -Method Post -Headers $headers -Body $body; ' +
                        '$response | ConvertTo-Json -Depth 10 ' +
                    '} catch { ' +
                        'Write-Error $_.Exception.Message ' +
                    '}"';
            } else {
                // For Mac using curl
                command = 'curl -s -X POST "' + url + '" ' +
                    '-H "Content-Type: application/json" ' +
                    '-d \'' + data + '\'';
            }
            
            var result = system.callSystem(command);
            return result;
            
        } catch (e) {
            throw new Error("HTTP request failed: " + e.toString());
        }
    }
    
    // Create and show the panel
    var panel = createPanel(thisObj);
    
    if (panel instanceof Window) {
        panel.center();
        panel.show();
    } else {
        panel.layout.layout(true);
    }
    
    return panel;
    
})(this);